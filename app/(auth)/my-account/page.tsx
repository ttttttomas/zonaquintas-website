"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Camera, CalendarDays, House, Languages, Mail, MapPin, Phone, Save, UserRound } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUser } from "@/app/context/UserContext";
import { AuthServices } from "@/app/services/AuthServices";
import AccountSectionLayout from "@/app/components/AccountSectionLayout";
import AddLanguage from "@/app/components/AddLanguage";

type ProfileForm = { name: string; email: string; phone: string; date_of_birth: string; address: string; description: string };
const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-primaryDark focus:ring-2 focus:ring-primaryDark/15";
function SectionHeading({ icon: Icon, title, description }: { icon: typeof UserRound; title: string; description?: string }) {
  return <div className="mb-4 flex items-start gap-3"><Icon size={20} className="mt-0.5 shrink-0 text-primaryDark" /><div><h2 className="text-sm font-semibold text-gray-900">{title}</h2>{description && <p className="mt-1 text-xs text-gray-500">{description}</p>}</div></div>;
}

export default function MyAccountPage() {
  const { user, loading, error, refetchUser } = useUser();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProfileForm>({ name: "", email: "", phone: "", date_of_birth: "", address: "", description: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    setSelected(user.languages || []);
    setForm({ name: user.name || "", email: user.email || "", phone: user.phone ? String(user.phone) : "", date_of_birth: user.date_of_birth ? String(user.date_of_birth).slice(0, 10) : "", address: user.address || "", description: user.description || "" });
  }, [user]);

  async function updateUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user?.id) return;
    setSaving(true);
    try {
      const result = await AuthServices.updateUser(user.id, { ...form, languages: selected });
      toast.success(result?.message || "Tus datos se guardaron correctamente.");
      await refetchUser();
    } catch (failure: unknown) {
      const message = (failure as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(message || "No pudimos guardar tus datos. Intentá nuevamente.");
    } finally { setSaving(false); }
  }

  async function changePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("La foto no puede superar los 5 MB."); event.target.value = ""; return; }
    const data = new FormData(); data.append("images", file); setSaving(true);
    try { await AuthServices.updatePicture(user.id, data); toast.success("Foto de perfil actualizada."); await refetchUser(); }
    catch { toast.error("No pudimos actualizar tu foto."); }
    finally { setSaving(false); event.target.value = ""; }
  }

  async function deletePhoto() {
    const picture = user?.pictures?.[0];
    if (!picture?.id || !user?.id) return;
    setSaving(true);
    try { await AuthServices.deletePicture(user.id, picture.id); toast.success("Foto de perfil eliminada."); await refetchUser(); }
    catch { toast.error("No pudimos eliminar tu foto."); }
    finally { setSaving(false); }
  }

  const field = (name: keyof ProfileForm, label: string, icon: typeof UserRound, type = "text") => <label className="block space-y-1.5 text-xs font-medium text-gray-700">{label}<span className="relative block"><IconForField icon={icon} /><input required={name === "name" || name === "email"} type={type} name={name} value={form[name]} onChange={e => setForm(previous => ({ ...previous, [name]: e.target.value }))} className={`${inputClass} pl-10`} /></span></label>;

  if (loading) return <AccountSectionLayout><div aria-busy="true" aria-label="Cargando tu perfil" className="animate-pulse space-y-5"><div className="h-12 w-56 rounded-xl bg-gray-200" /><div className="h-[560px] rounded-2xl bg-gray-200" /></div></AccountSectionLayout>;
  if (error || !user) return <AccountSectionLayout><p role="alert" className="rounded-xl border border-red-100 bg-white p-6 text-red-700">{error || "Iniciá sesión para ver tu perfil."}</p></AccountSectionLayout>;

  return <AccountSectionLayout>
    <header className="mb-6"><h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">Mi perfil</h1><p className="mt-1 text-sm text-gray-500">Mantené tus datos actualizados para una mejor experiencia en ZonaQuintas.</p></header>
    <form onSubmit={updateUser} className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[190px_minmax(0,1fr)]">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-5">
          <input type="file" ref={fileInputRef} onChange={changePhoto} className="hidden" accept="image/png,image/jpeg,image/webp" />
          <div className="relative"><img src={user.pictures?.[0]?.url || "/picture_user.jpg"} alt={`Foto de perfil de ${user.name || "usuario"}`} className="size-28 rounded-full bg-gray-100 object-cover" /><button type="button" onClick={() => fileInputRef.current?.click()} disabled={saving} aria-label="Cambiar foto de perfil" className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-primaryDark p-2 text-white hover:bg-green-700 disabled:opacity-50"><Camera size={17} /></button></div>
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={saving} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primaryDark px-4 py-2 text-xs font-semibold text-primaryDark hover:bg-green-50 disabled:opacity-50"><Camera size={15} />Cambiar foto de perfil</button>
          {user.pictures?.[0] && <button type="button" onClick={deletePhoto} disabled={saving} className="mt-2 text-xs text-gray-500 underline hover:text-red-600">Eliminar foto</button>}
          <p className="mt-2 text-center text-[10px] text-gray-400">JPG o PNG. Máx. 5 MB.</p>
        </div>
        <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
          <SectionHeading icon={UserRound} title="Mis datos personales" />
          <div className="grid gap-4 md:grid-cols-2">
            {field("name", "Nombre completo", UserRound)}
            {field("phone", "Teléfono", Phone, "tel")}
            {field("date_of_birth", "Fecha de nacimiento", CalendarDays, "date")}
            {field("email", "Correo electrónico", Mail, "email")}
            <div className="md:col-span-2">{field("address", "Dirección", MapPin)}</div>
          </div>
        </section>
      </section>
      <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6"><SectionHeading icon={Languages} title="Idiomas que hablás" description="Seleccioná los idiomas en los que te podés comunicar." /><AddLanguage selected={selected} setSelected={setSelected} /></section>
      <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6"><SectionHeading icon={UserRound} title="Sobre vos" description="Contanos un poco más sobre tu perfil (opcional)." /><label className="sr-only" htmlFor="description">Descripción</label><textarea id="description" value={form.description} onChange={e => setForm(previous => ({ ...previous, description: e.target.value.slice(0, 500) }))} rows={3} maxLength={500} className={inputClass + " resize-y"} placeholder="Escribí una breve descripción" /><p className="mt-1 text-right text-xs text-gray-400">{form.description.length}/500</p></section>
      <div className="flex justify-end"><button disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primaryDark px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaryDark disabled:opacity-60 sm:w-auto"><Save size={17} />{saving ? "Guardando…" : "Guardar cambios"}</button></div>
    </form>
    <div className="mt-5 grid gap-3 sm:grid-cols-2"><Link href="/reservations" className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 hover:border-primaryDark"><CalendarDays className="text-primaryDark" /><span><strong className="block text-sm">Mis reservas</strong><span className="text-xs text-gray-500">Consultá próximas reservas, estados y detalles.</span></span></Link><Link href="/publications" className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 hover:border-primaryDark"><House className="text-primaryDark" /><span><strong className="block text-sm">Mis publicaciones</strong><span className="text-xs text-gray-500">Administrá tus quintas publicadas.</span></span></Link></div>
  </AccountSectionLayout>;
}

function IconForField({ icon: Icon }: { icon: typeof UserRound }) { return <Icon aria-hidden="true" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />; }
