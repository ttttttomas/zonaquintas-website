import { apiClient } from "@/lib/axios";

export const AuthServices = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post(
      "/login",
      { email, password },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response;
  },
  register: async (data: any) => {
    const response = await apiClient.post(
      "/register",
      { data },
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    return response;
  },
  me: async () => {
    const response = await apiClient.get("/me");
    return response.data;
  },
};
