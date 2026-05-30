"use client";
import PlacesAutocomplete from "@/app/components/PlacesAutocomplete";
import { useQuintaForm } from "@/app/context/QuintaFormContext";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Paso2Page() {
  const { form, updateForm } = useQuintaForm();
  const router = useRouter();

  const mainImagePreview = useMemo(() => {
    if (!form.main_image) return null;
    return URL.createObjectURL(form.main_image as any);
  }, [form.main_image]);

  const additionalImagesPreviews = useMemo(() => {
    return form.images.map((file) => URL.createObjectURL(file as any));
  }, [form.images]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const { title, description, main_image, images, address } = form;

    if (!title || !description) {
      toast.error("Por favor completa el título y la descripción");
      return;
    }

    if (!main_image) {
      toast.error("Por favor selecciona una foto principal");
      return;
    }

    if (images.length < 5) {
      toast.error("Debes subir al menos 5 imágenes adicionales");
      return;
    }

    if (!address) {
      toast.error("Por favor ubica la quinta en el mapa");
      return;
    }

    router.push("/publicar-quinta/paso-3");
  };

  return (
    <main className="flex md:flex-row flex-col mb-10 md:mb-0 gap-10 md:gap-0 items-center justify-between mx-10 md:mx-20">
      <section className="flex flex-col items-start justify-center w-full md:w-1/3">
        <h1 className="font-semibold text-xl mb-5 text-gray-800">
          Sigamos con los pasos finales
        </h1>
        <form onSubmit={handleContinue} className="w-full flex flex-col gap-6 rounded-xl">
          {/* ── Título ── */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-gray-700 font-semibold text-sm">
              Título de la publicación*
            </label>
            <input
              placeholder="Ej: Hermosa quinta con pileta en pilar"
              className="w-full bg-white border border-gray-300 focus:border-primaryDark focus:ring-2 focus:ring-primaryDark/20 outline-none px-4 py-3 rounded-xl transition duration-200 shadow-sm placeholder:text-gray-400 text-gray-800 font-medium"
              value={form.title}
              onChange={(e) => updateForm({ title: e.target.value })}
            />
          </div>

          {/* ── Descripción ── */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-gray-700 font-semibold text-sm">
              Descripción detallada*
            </label>
            <textarea
              placeholder="Contanos sobre tu quinta, servicios, comodidades, etc."
              className="w-full bg-white border border-gray-300 focus:border-primaryDark focus:ring-2 focus:ring-primaryDark/20 outline-none px-4 py-3 rounded-xl transition duration-200 shadow-sm placeholder:text-gray-400 text-gray-800 font-medium min-h-28 resize-y"
              value={form.description}
              onChange={(e) => updateForm({ description: e.target.value })}
            />
          </div>

          {/* ── Imagen principal ─────────────────────────────────── */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-gray-700 font-semibold text-sm">
              Foto principal de tu quinta*
            </label>
            <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-white hover:bg-gray-50 hover:border-primaryDark transition-all duration-200 overflow-hidden relative group">
              {mainImagePreview ? (
                <>
                  <img
                    src={mainImagePreview}
                    alt="Preview principal"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <span className="text-white text-sm font-semibold">Cambiar foto</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                  <svg
                    className="w-8 h-8 mb-3 text-gray-400 group-hover:text-primaryDark transition-colors duration-200"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-1 text-sm text-gray-500 font-semibold">
                    Subir foto de portada
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG o WEBP (máx. 10MB)</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    updateForm({ main_image: file as any });
                  }
                }}
              />
            </label>
            {form.main_image && (
              <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
                ✓ Foto principal cargada correctamente
              </p>
            )}
          </div>

          {/* ── Imágenes adicionales ──────────────────────────────── */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-gray-700 font-semibold text-sm">
              Otras imágenes* <span className="text-gray-500 font-normal">(mínimo 5 — recomendamos mostrar todos los ambientes)</span>
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-white hover:bg-gray-50 hover:border-primaryDark transition-all duration-200 overflow-hidden group">
              <div className="flex flex-col items-center justify-center pt-4 pb-4 px-4 text-center">
                <svg
                  className="w-8 h-8 mb-2 text-gray-400 group-hover:text-primaryDark transition-colors duration-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="text-sm text-gray-500 font-semibold">
                  Seleccionar imágenes adicionales
                </p>
                <p className="text-xs text-gray-400">Selecciona 5 o más archivos</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    updateForm({ images: Array.from(files) as any });
                  }
                }}
              />
            </label>
            {additionalImagesPreviews.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-xs text-gray-600 font-semibold">
                  Imágenes seleccionadas ({additionalImagesPreviews.length}):
                </p>
                <div className="flex gap-2 flex-wrap max-h-36 overflow-y-auto p-1 bg-gray-50 rounded-xl border border-gray-100">
                  {additionalImagesPreviews.map((src, i) => (
                    <div key={i} className="relative size-14 rounded-lg overflow-hidden border border-gray-200 shadow-sm shrink-0">
                      <img
                        src={src}
                        alt={`Preview ${i + 1}`}
                        className="size-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {form.images.length > 0 && (
              <p className={`text-xs font-medium flex items-center gap-1 mt-1 ${form.images.length >= 5 ? "text-green-600" : "text-amber-600"}`}>
                {form.images.length >= 5 ? "✓ Requisito mínimo de 5 imágenes cumplido" : `⚠ Cargaste ${form.images.length} de 5 imágenes mínimas`}
              </p>
            )}
          </div>

          {/* ── Ubicación ─────────────────────────────────────────── */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-gray-700 font-semibold text-sm">
              Ubica tu quinta en el mapa* <span className="text-gray-500 font-normal">(Escribí la dirección exacta)</span>
            </label>
            <div className="flex flex-col gap-1">
              <PlacesAutocomplete
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
                onLocation={({ address, lat, lng, neighborhood }) => {
                  updateForm({
                    address,
                    latitude: lat,
                    length: lng,
                    city: neighborhood || "",
                  });
                }}
              />
            </div>
            {form.address && (
              <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
                📍 {form.address}{form.city && ` — ${form.city}`}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-primaryDark hover:bg-primaryDark/90 text-center cursor-pointer text-white py-3 font-bold text-xl rounded-xl transition duration-150 shadow-md hover:shadow-lg active:scale-[0.99] w-full mt-2">
            Continuar
          </button>
        </form>
      </section>
      <img className="object-cover" src="/paso2.png" alt="paso 2" />
    </main>
  );
}
