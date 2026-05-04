import { apiClient } from "@/lib/axios";
import { Users } from "@/types";

export const ProductsServices = {
  getQuintas: async () => {
    const response = await apiClient.get("/quintas");

    if (response.status === 200) {
      return response.data;
    }
    return null;
  },
  getQuintaById: async (id: string) => {
    const response = await apiClient.get(`/quintas/${id}`);

    if (response.status === 200) {
      return response.data;
    }
    return null;
  },

  createQuinta: async (formData: FormData) => {
    const response = await apiClient.post("/quintas", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
    return null;
  },
  getOwnerById: async (id: string) => {
    const response = await apiClient.get<Users>(`/user_by_id?id=${id}`);

    if (response.status === 200) {
      return response.data;
    }
    return null;
  },
  getWallet: async (id: string) => {
    const response = await apiClient.get(`/dashboard/${id}`);

    if (response.status === 200) {
      return response.data;
    }
    return null;
  },

  getAddressFromQuintas: async () => {
    const response = await apiClient.get(`/quintas/getAddressFromQuintas`);

    if (response.status === 200) {
      return response.data;
    }
    return null;
  },

  changeStatusQuinta: async (id: string, status: "active" | "pending" | "rejected" | "cancelled") => {
    const response = await apiClient.patch(`/quintas/${id}/status`, { status });

    if (response.status === 200) {
      return response.data;
    }
    return null;
  },
};
