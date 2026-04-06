import { apiClient } from "@/lib/axios";

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
};
