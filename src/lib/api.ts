import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: "https://api.openweathermap.org/data/3.0/onecall",
  timeout: 10000,
});

// Helper para pegar erros de forma limpa
export const handleApiError = (error: unknown): null => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    console.error(
      "API Error:",
      axiosError.response?.data ?? axiosError.message,
    );
  } else if (error instanceof Error) {
    console.error("Unexpected Error:", error.message);
  } else {
    console.error("Unknown Error:", error);
  }

  return null;
};
