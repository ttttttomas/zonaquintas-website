"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftRight } from "lucide-react";
import { useUser } from "@/app/context/UserContext";

export default function ExperienceSwitcher({ onSwitch }: { onSwitch?: () => void }) {
  const { user, loading, viewMode, setViewMode } = useUser();
  const router = useRouter();
  if (loading) return <span aria-label="Cargando modo" className="block h-10 w-36 animate-pulse rounded-full bg-gray-200" />;
  if (!user) return null;
  return <button type="button" onClick={() => {
    const next = viewMode === "owner" ? "guest" : "owner";
    setViewMode(next);
    onSwitch?.();
    router.push(next === "owner" ? "/propietario" : "/");
  }} className="inline-flex cursor-pointer min-h-11 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-800 hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaryDark">
    <ArrowLeftRight size={17} aria-hidden="true" />
    {viewMode === "owner" ? "Modo huésped" : "Modo propietario"}
  </button>;
}
