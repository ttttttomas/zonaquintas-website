"use client";
import Link from "next/link";
import { useUser } from "@/app/context/UserContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AuthServices } from "@/app/services/AuthServices";
import AddLanguage from "@/app/components/AddLanguage";

export default function MyAccountPage() {
  const { user, loading, error, refetchUser } = useUser();
  const [selected, setSelected] = useState<string[]>([]);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Cuando cargas el usuario, setea formData
  useEffect(() => {
    if (user) {
      setSelected(user?.languages || []);
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        date_of_birth: user?.date_of_birth || "",
        address: user?.address || "",
        description: user?.description || "",
        role: user?.role || "",
        owner_time: user?.owner_time || "",
        owner_location: user?.owner_location || "",
        average_opinions: user?.average_opinions || 0,
        languages: user?.languages || [],
        opinions: user?.opinions || [],
        picture: user?.pictures?.[0] || null,
      });
    }
  }, [user]);

  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      languages: selected,
    }));
  }, [selected]);

  // Actualizar inputs con formData
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingUser(true);
    try {
      const res = await AuthServices.updateUser(user?.id,
        {
          ...formData,
          languages: selected
        }
      );
      toast.success(res?.data?.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail);
    } finally {
      setLoadingUser(false);
    }
  };

  if (loading) {
    return (
      <main className="flex w-full justify-center items-center py-20">
        <p className="text-gray-500 text-lg">Cargando datos...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex w-full justify-center items-center py-20">
        <p className="text-red-500 text-lg">{error}</p>
      </main>
    );
  }
  if (loadingUser) {
    return (
      <main className="flex w-full justify-center items-center py-20">
        <p className="text-gray-500 text-lg">Cargando datos...</p>
      </main>
    );
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataToUpload = new FormData();
    formDataToUpload.append("images", file);

    try {
      setLoadingUser(true);
      const res = await AuthServices.updatePicture(user?.id, formDataToUpload);
      console.log("Update picture response:", res);
      toast.success("Foto de perfil actualizada correctamente");
      await refetchUser();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Error al actualizar la foto");
    } finally {
      setLoadingUser(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!formData?.picture?.id) return;
    try {
      setLoadingUser(true);
      await AuthServices.deletePicture(user?.id, formData.picture.id);
      toast.success("Foto de perfil eliminada correctamente");
      await refetchUser();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Error al eliminar la foto");
    } finally {
      setLoadingUser(false);
    }
  };

  console.log(formData?.picture)
  return (
    <main className="flex flex-col md:flex-row w-full md:px-20 justify-between gap-10 md:gap-20 items-center md:items-start">
      <div className="flex flex-col justify-center items-center gap-5">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        {formData?.picture?.url ? (
          <>
            <img
              src={formData?.picture?.url}
              alt="User profile"
              className="w-32 md:w-[150px] rounded-xl"
            />
            <button
              onClick={handleDeleteImage}
              disabled={loadingUser}
              className="bg-red-500 px-5 mt-5 py-2 text-white md:w-auto w-full font-semibold rounded-md cursor-pointer hover:bg-red-600 transition-colors"
              type="button"
            >
              Eliminar foto de perfil
            </button>
          </>
        ) : (
          <>
            <img
              src="/picture_user.jpg"
              alt="User profile"
              className="w-32 md:w-[150px] rounded-xl"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loadingUser}
              className="bg-primaryDark px-5 mt-5 py-2 text-white md:w-auto w-full font-semibold rounded-md cursor-pointer"
              type="button"
            >
              Modificar foto de perfil
            </button>
          </>
        )}
      </div>
      <form
        onSubmit={updateUser}
        className="flex flex-col md:mx-0 mx-10 bg-white w-full max-w-5xl px-5 xl:px-20 gap-2 shadow-lg py-10 shadow-black/20 flex-1 text-black"
      >
        <h1 className="text-center font-semibold text-xl">Mis datos</h1>
        <input
          placeholder="Nombre completo"
          name="name"
          defaultValue={formData?.name ?? ""}
          onChange={handleChange}
          className="border-gray-200 px-2 border-2 xl:w-full mx-auto py-1 rounded-md w-full"
          type="text"
        />
        <input
          placeholder="Telefono"
          name="phone"
          defaultValue={formData?.phone}
          onChange={handleChange}
          className="border-gray-200 px-2 border-2 xl:w-full mx-auto py-1 rounded-md w-full"
          type="text"
        />
        <input
          placeholder="Fecha de nacimiento"
          name="date_of_birth"
          onChange={handleChange}
          defaultValue={
            formData?.date_of_birth
              ? new Date(formData.date_of_birth).toLocaleDateString()
              : ""
          }
          className="border-gray-200 px-2 border-2 xl:w-full mx-auto py-1 rounded-md w-full"
          type="text"
        />
        <input
          placeholder="Mail"
          name="email"
          defaultValue={formData?.email ?? ""}
          onChange={handleChange}
          className="border-gray-200 px-2 border-2 xl:w-full mx-auto py-1 rounded-md w-full"
          type="text"
        />
        <input
          placeholder="Dirección"
          name="address"
          defaultValue={formData?.address ?? ""}
          onChange={handleChange}
          className="border-gray-200 px-2 border-2 xl:w-full mx-auto py-1 rounded-md w-full"
          type="text"
        />
        {formData?.languages && (
          <AddLanguage selected={formData.languages} setSelected={setSelected} />
        )}
        <input
          placeholder="Descripcion"
          name="description"
          defaultValue={formData?.description ?? ""}
          onChange={handleChange}
          className="border-gray-200 px-2 border-2 xl:w-full mx-auto py-1 rounded-md w-full"
          type="text"
        />
        <button
          className="bg-primaryDark xl:mx-52 mt-5 py-2 text-white md:w-auto w-full font-semibold rounded-md cursor-pointer"
          type="submit"
        >
          Modificar datos
        </button>
      </form>
      <div className="flex flex-col items-center justify-between gap-60">

        <div className="w-full md:w-64 shrink-0">
          <Link
            href="/reservations"
            className="block bg-white border-2 border-primaryDark text-primaryDark hover:bg-primaryDark hover:text-white transition-all rounded-2xl p-8 text-center shadow-lg shadow-green-100 group"
          >
            <p className="font-bold text-2xl group-hover:scale-110 transition-transform">Mis reservas</p>
          </Link>
        </div>
        <Link
          href="/publications"
          className="block bg-white border-2 border-primaryDark text-primaryDark hover:bg-primaryDark hover:text-white transition-all rounded-2xl p-8 text-center shadow-lg shadow-green-100 group"
        >
          <p className="font-bold text-2xl group-hover:scale-110 transition-transform">Mis publicaciones</p>
        </Link>
      </div>
    </main>
  );
}
