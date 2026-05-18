import { useState, useCallback } from "react";
import { useStore } from "@/context/store";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;

export const useGeoLocation = () => {
  const { setCoords } = useStore();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      const msg = t.geoNotSupported;
      setError(msg);
      toast.error(msg);
      setIsLoading(false);
      return;
    }

    const toastId = toast.loading(t.geoRetrieving);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;

        try {
          const params = new URLSearchParams({
            lat: String(lat),
            lon: String(lon),
            limit: "1",
            appid: API_KEY ?? "",
          });
          const res = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?${params}`,
          );
          const data = res.ok ? await res.json() : [];

          const cityName = data?.[0]?.name ?? t.yourLocation;
          const countryCode = data?.[0]?.country ?? "";

          setCoords({ lat, lon, name: cityName, country: countryCode });
          toast.success(t.geoSuccess, { id: toastId });
        } catch {
          setCoords({ lat, lon, name: t.yourLocation, country: "" });
          toast.success(t.geoSuccess, { id: toastId });
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        const msg = t.geoPermissionDenied;
        setError(msg);
        toast.error(msg, { id: toastId });
        setIsLoading(false);
        console.error(err);
      },
      { timeout: 10000, maximumAge: 60000 }, // cache GPS por 1 min
    );
  }, [setCoords, t]);

  return { getLocation, isLoading, error };
};
