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
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = await response.json();
    if (!response.ok) {
      throw { response: { status: response.status, data: payload } };
    }
    return { status: response.status, data: payload };
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
  },
  updatePicture: async (id: any, data: any) => {
    const response = await apiClient.put(`/users/${id}/images`, data,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      },
    );
    return response.data;
  },
  deletePicture: async (userId: any, imageId: any) => {
    const response = await apiClient.delete(`/users/${userId}/images/${imageId}`);
    return response.data;
  },
};
