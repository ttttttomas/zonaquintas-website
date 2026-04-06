"use client";
import { Users } from "@/types";
import { AuthServices } from "@/app/services/AuthServices";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface UserContextType {
  user: Users | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  refetchUser: () => Promise<void>;
  checkAuthentication: () => Promise<boolean>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AuthServices.me();
      setUser(data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Error al obtener el usuario");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const checkAuthentication = useCallback(async (): Promise<boolean> => {
    try {
      const data = await AuthServices.me();
      setUser(data);
      setError(null);
      return true;
    } catch {
      setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        refetchUser: fetchUser,
        checkAuthentication,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
};
