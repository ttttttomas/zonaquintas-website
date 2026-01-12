import axios from "axios";

export const ProductsServices = {
  getQuintas: async () => {
    const response = await axios.get(
        "https://zonaquintas.com/MdpuF8KsXiRArNlHtl6pXO2XyLSJMTQ8_Zonaquintas/api/quintas/quintas"
        // "localhost:8000/quintas/quintas"
    );

    if (response.status === 200) {
      return response.data;
    }
    return null;
  },
  getQuintaById: async (id: string) => {
    const response = await axios.get(
        `https://zonaquintas.com/MdpuF8KsXiRArNlHtl6pXO2XyLSJMTQ8_Zonaquintas/api/quintas/quintas/${id}`
        // "localhost:8000/quintas/quinta/${id}"
    );

    if (response.status === 200) {
      return response.data;
    }
    return null;
  },
};