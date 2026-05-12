import { apiClient } from "@/lib/axios";
import { Users } from "@/types";

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
      data,
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
  getUserById: async (id: string): Promise<Users | null> => {
    const response = await apiClient.get(`/user_by_id?id=${id}`);
    return response.data;
  },
  updateUser: async (id: any, data: any) => {
    const response = await apiClient.put(`/user/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json"
        },
      },
    );
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post("/logout");
    return response.data;
  }
};
