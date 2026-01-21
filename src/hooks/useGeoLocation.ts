import { useState } from "react";
import { useStore } from "@/context/store";
import { toast } from "sonner";
import axios from "axios";
import { useTranslation } from "@/hooks/useTranslation";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;

export const useGeoLocation = () => {
  const { setCoords } = useStore();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    setIsLoading(true);
    setError(null);

    // Verifica suporte do navegador
    if (!navigator.geolocation) {
      const msg = t.geoNotSupported;
      setError(msg);
      toast.error(msg);
      setIsLoading(false);
      return;
    }

    // Feedback visual inicial
    const toastId = toast.loading(t.geoRetrieving);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          // Reverse Geocoding: Transforma Lat/Lon em Nome de Cidade
          const response = await axios.get(
            `https://api.openweathermap.org/geo/1.0/reverse`,
            {
              params: {
                lat,
                lon,
                limit: 1,
                appid: API_KEY,
              },
            }
          );

          let cityName = t.yourLocation;
          let countryCode = "";

          if (response.data && response.data.length > 0) {
            cityName = response.data[0].name;
            countryCode = response.data[0].country;
          }

          // Salva no Store
          setCoords({
            lat,
            lon,
            name: cityName,
            country: countryCode,
          });

          // Sucesso
          toast.success(t.geoSuccess, { id: toastId });
        } catch (err) {
          // Fallback se a API de Reverse Geocoding falhar (mas a localização funcionou)
          console.error("Erro no reverse geocoding:", err);
          setCoords({
            lat,
            lon,
            name: t.yourLocation,
            country: "",
          });
          toast.success(t.geoSuccess, { id: toastId });
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        // Erro de Permissão ou GPS
        const msg = t.geoPermissionDenied;
        setError(msg);
        toast.error(msg, { id: toastId });
        setIsLoading(false);
        console.error(err);
      }
    );
  };

  return { getLocation, isLoading, error };
};