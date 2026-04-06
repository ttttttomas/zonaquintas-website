import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number } };

      if (axiosError.response?.status === 401) {
        // Token inválido o expirado
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        // Solo redirigir a login si estamos en una ruta protegida (/system)
        if (
          typeof window !== "undefined" &&
          window.location.pathname.startsWith("/system")
        ) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);
