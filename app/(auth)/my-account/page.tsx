"use client";
import Link from "next/link";
import { useUser } from "@/app/context/UserContext";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { AuthServices } from "@/app/services/AuthServices";
import AddLanguage from "@/app/components/AddLanguage";

export default function MyAccountPage() {
  const { user, loading, error } = useUser();
  const [selected, setSelected] = useState<string[]>([]);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({});
  // Cuando cargas el usuario, setea formData
  useMemo(() => {
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
        pictures: user?.picture || [],
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
    const res =await AuthServices.updateUser(user?.id, 
    {...formData,
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

  console.log(selected)
  return (
    <main className="flex flex-col md:flex-row w-full md:px-20 justify-between gap-10 md:gap-20 items-center md:items-start">
      {!formData?.picture && (
        <img
          src="picture_user.jpg"
          alt="User profile"
          className="w-32 md:w-[150px] rounded-xl"
        />
      )}
      {formData?.picture && (
        <img
          src={formData?.picture[0]}
          alt="formData profile"
          onChange={handleChange}
          className="w-32 md:w-[150px] rounded-xl"
        />
      )}
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
        <Link
          href="/reservations"
          className="bg-primaryDark text-white rounded-full cursor-pointer size-42 text-center pt-16 font-bold text-2xl"
        >
          Mis reservas
        </Link>
        <Link
          href="/publications"
          className="bg-primaryDark text-white rounded-2xl py-5 px-10 cursor-pointer text-nowrap text-center font-bold text-2xl"
        >
          Mis publicaciones
        </Link>
      </div>
    </main>
  );
}
