import axios from "axios";

export const AuthServices = {
  login: async (email: string, password: string) => {
    const response = await axios.post(
      "/api/auth/login", 
      { email, password },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status === 200) {
      return response;
    }
    return null;
  },
  register: async (email: string, password: string, name: string, date_of_birth: string) => {
     const response = await axios.post(
      "/api/auth/register", 
      { email, password, name, date_of_birth },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status === 200) {
      return response;
    }
    return null;
  },
};