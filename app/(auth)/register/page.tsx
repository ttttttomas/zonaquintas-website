"use client";
import { useForm } from "react-hook-form";
import { AuthServices } from "@/app/services/AuthServices";
import toast, { Toaster } from "react-hot-toast";

type RegisterFormData = {
  name: string;
  email: string;
  date_of_birth: string;
  password: string;
  confirm_password: string;
  phone: string;
};

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<RegisterFormData>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.password !== data.confirm_password) {
        toast.error("Las contraseñas no coinciden");
        return;
      }
      const phone = data.phone?.replace(/\D/g, "");
      const response = await AuthServices.register({
        name: data.name?.trim() || null,
        email: data.email.trim(),
        date_of_birth: data.date_of_birth || null,
        password: data.password,
        phone: phone ? Number(phone) : null,
      });
      if (response?.status >= 200 && response?.status < 300) {
        window.location.href = "/login?registered=1";
      }
    } catch (error: any) {
      const detail = error?.response?.data?.detail;
      const validationMessage = Array.isArray(detail)
        ? detail.map((item: { msg?: string }) => item.msg).filter(Boolean).join(". ")
        : typeof detail === "string" ? detail : undefined;
      const message = validationMessage || error?.response?.data?.message ||
        "Error al registrarse. Revise su conexión y/o credenciales.";
      toast.error(message);
    }
  });
  return (
    <main className="relative flex items-center min-h-[calc(100dvh-5rem)] md:pt-0 pt-8 justify-center pb-16 px-4 sm:px-6 lg:px-8">
      <Toaster position="bottom-center" />
      <div className="absolute inset-0 publicar -z-10 w-full" />
      <form
        onSubmit={onSubmit}
        className="w-full max-w-4xl px-3 sm:px-5 md:px-20 gap-4 sm:gap-5 py-8 sm:py-10 shadow-black/20 flex flex-col text-black">
        <img
          src="/logo.png"
          className="size-24 sm:size-30 mx-auto object-contain mb-2 sm:mb-5"
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
