"use client";
import { usePathname } from "next/navigation";
import { routeViewMode } from "@/app/lib/experience";
import { Users } from "@/types";
import { AuthServices } from "@/app/services/AuthServices";
import {
  createContext,
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
  refetchUser: () => Promise<Users | null>;
  viewMode: UserViewMode;
  setViewMode: (mode: UserViewMode) => void;
  // checkAuthentication: () => Promise<boolean>;
}

export type UserViewMode = "guest" | "owner";

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<UserViewMode>("guest");
  const [viewModeUserId, setViewModeUserId] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const {current_user} = await AuthServices.me();

      
      const data = await AuthServices.getUserById(current_user);
      setUser(data);
      return data;
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Error al obtener el usuario");
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // const checkAuthentication = useCallback(async (): Promise<boolean> => {
  //   try {
  //     const data = await AuthServices.me();
  //     setUser(data);
  //     setError(null);
  //     return true;
  //   } catch {
  //     setUser(null);
  //     return false;
  //   }
  // }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user?.id) {
      setViewMode("guest");
      setViewModeUserId(null);
      return;
    }

    try {
      const savedMode = window.localStorage.getItem(`zonaquintas:view-mode:${user.id}`);
      setViewMode(routeViewMode(pathname) ?? (savedMode === "owner" ? "owner" : "guest"));
    } catch {
      setViewMode("guest");
    }
    setViewModeUserId(user.id);
  }, [loading, user?.id, pathname]);

  useEffect(() => {
    if (loading || !user?.id || viewModeUserId !== user.id) return;
    try {
      window.localStorage.setItem(`zonaquintas:view-mode:${user.id}`, viewMode);
    } catch {
      // La preferencia sigue funcionando en memoria si el navegador no permite storage.
    }
  }, [loading, user?.id, viewMode, viewModeUserId]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        refetchUser: fetchUser,
        viewMode: routeViewMode(pathname) ?? (viewModeUserId === user?.id ? viewMode : "guest"),
        setViewMode,
        // checkAuthentication,
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
