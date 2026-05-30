"use client";
import { useForm } from "react-hook-form";
import { AuthServices } from "@/app/services/AuthServices";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.password !== data.confirm_password) {
        toast.error("Las contraseñas no coinciden");
        return;
      }
      const response = await AuthServices.register(data);
      if (response?.status === 200) {
        console.log(response);
        toast.success(`${response.data.message}`);
        setTimeout(() => {
          window.location.href = "/my-account";
        }, 2000);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Error al registrarse. Revise su conexión y/o credenciales.";
      toast.error(message);
    }
  });
  return (
    <main className="flex items-center h-[80vh] justify-center pb-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="bottom-center" />
      <div className="absolute publicar h-[86vh] -z-10 w-full" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="bg-white w-full max-w-4xl px-5 md:px-20 gap-5 shadow-lg py-10 shadow-black/20 flex flex-col text-black">
        <img
          src="/logo.png"
          className="size-30 mx-auto object-cover mb-5"
          alt="logo"
        />
        <h1 className="text-xl md:text-3xl font-bold text-center">
          Registrarse
        </h1>
        <input
          {...register("name")}
          className="border border-black/30 rounded-lg p-2"
          placeholder="Nombre completo"
          type="text"
        />
        <input
          {...register("email")}
          className="border border-black/30 rounded-lg p-2"
          placeholder="Correo electronico"
          type="email"
        />
        <input
          {...register("date_of_birth")}
          className="border border-black/30 rounded-lg p-2"
          placeholder="Fecha de nacimiento"
          type="date"
        />
        <input
          {...register("password")}
          className="border border-black/30 rounded-lg p-2"
          placeholder="Contraseña"
          type="password"
        />
        <input
          {...register("confirm_password")}
          className="border border-black/30 rounded-lg p-2"
          placeholder="Confirmar contraseña"
          type="password"
        />
        <input
          {...register("phone")}
          className="border border-black/30 rounded-lg p-2"
          placeholder="Telefono"
          type="text"
        />
        <button
          className="bg-primaryDark cursor-pointer text-white py-3 rounded-lg"
          type="submit">
          Registrate
        </button>
      </form>
    </main>
  );
}
