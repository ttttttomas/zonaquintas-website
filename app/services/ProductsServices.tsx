import { apiClient } from "@/lib/axios";
import { QuintaAvailability, Quintas, Users } from "@/types";

export const ProductsServices = {
  getAvailability: async (id: string, from: string, to: string): Promise<QuintaAvailability> => {
    const response = await apiClient.get<QuintaAvailability>(`/quintas/${id}/availability`, { params: { from, to } });
    return response.data;
  },
  getQuintas: async () => {
    const response = await apiClient.get("/quintas");

    if (response.status === 200) {
      return response.data;
    }
    return null;
  },
  getQuintasActive: async (): Promise<Quintas[]> => {
    const response = await apiClient.get("/quintas");

    if (response.status === 200) {
      const quintas = response.data;
      const quintasActive = Array.isArray(quintas)
        ? quintas.filter((quinta: any) => quinta.status === "active")
        : [];
      return quintasActive;
    }
    return [];
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
