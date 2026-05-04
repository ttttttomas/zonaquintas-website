"use client";
import { useForm } from "react-hook-form";
import { AuthServices } from "@/app/services/AuthServices";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const { refetchUser } = useUser();
  const { register, handleSubmit } = useForm();
  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await AuthServices.login(data.email, data.password);
      if (response?.status === 200) {
        await new Promise<void>((resolve) => {
          toast.success(response.data.message, { duration: 2000 });
          setTimeout(resolve, 2000);
        });
        await refetchUser();
        router.push("/");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Error al iniciar sesión. Revise su conexión y/o credenciales.";
      toast.error(message);
    }
  });
  return (
    <main className="flex items-center h-[60vh] justify-center pb-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="bottom-center" />
      <div className="absolute publicar h-[66vh] -z-10 w-full" />
      <form
        onSubmit={onSubmit}
        className="bg-white w-full max-w-4xl px-5 md:px-20 gap-5 shadow-lg py-10 shadow-black/20 flex flex-col text-black">
        <img
          src="/logo.png"
          className="size-30 mx-auto object-cover mb-5"
          alt="logo"
        />
        <h1 className="text-xl md:text-3xl font-bold text-center">
          Iniciar sesión
        </h1>
        <input
          {...register("email")}
          className="border border-black/30 rounded-lg p-2"
          placeholder="Correo electronico"
          type="text"
        />
        <input
          {...register("password")}
          className="border border-black/30 rounded-lg p-2"
          placeholder="Contraseña"
          type="password"
        />
        <button
          className="bg-primaryDark cursor-pointer text-white py-3 rounded-lg"
          type="submit">
          Iniciar sesión
        </button>
      </form>
    </main>
  );
}
