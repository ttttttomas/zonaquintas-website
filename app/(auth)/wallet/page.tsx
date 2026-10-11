"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, ChevronDown, CircleHelp, Coins, ArrowLeftRight, Wallet as WalletIcon, Bell, X, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUser } from "@/app/context/UserContext";
import { ProductsServices } from "@/app/services/ProductsServices";
import AccountSectionLayout from "@/app/components/AccountSectionLayout";
import type { Transaction, Wallet } from "@/types";

const button = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaryDark disabled:cursor-not-allowed disabled:opacity-50";
const currencyAmount = (amount: number, currency: string) => new Intl.NumberFormat("es-AR", { style: "currency", currency, maximumFractionDigits: 2 }).format(Number(amount || 0));

function WalletSkeleton() { return <AccountSectionLayout><div aria-busy="true" aria-label="Cargando billetera" className="animate-pulse space-y-5"><div className="h-44 rounded-2xl bg-gray-200"/><div className="grid gap-4 md:grid-cols-3">{[0,1,2].map(i=><div key={i} className="h-28 rounded-2xl bg-gray-200"/>)}</div><div className="h-80 rounded-2xl bg-gray-200"/></div></AccountSectionLayout>; }

function BalanceCard({ title, amount, description, icon: Icon, color }: { title: string; amount: Wallet["balances"]["retenido"]; description: string; icon: typeof WalletIcon; color: string }) {
  return <article className={`rounded-2xl border border-gray-100 p-5 ${color}`}><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-gray-600">{title}</p><p className="mt-2 text-xl font-semibold text-gray-900 md:text-2xl">{currencyAmount(amount.ARS,"ARS")}</p><p className="mt-1 text-sm font-medium text-gray-500">{currencyAmount(amount.USD,"USD")}</p></div><span className="rounded-xl bg-white/80 p-3 text-primaryDark"><Icon size={21}/></span></div><p className="mt-3 text-xs text-gray-500">{description}</p></article>;
}

function TransactionStatus({ status }: { status: string }) {
  const normalized = status.toUpperCase();
  const tone = normalized === "DISPONIBLE" ? "bg-amber-100 text-amber-800" : normalized === "RETENIDO" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-800";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${tone}`}>{normalized || "SIN ESTADO"}</span>;
}

export default function WalletPage() {
  const { user, loading: authLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [revision, setRevision] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [bankAccount, setBankAccount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) { setLoading(false); return; }
    const controller = new AbortController(); setLoading(true); setLoadError(false);
    ProductsServices.getWallet(user.id).then((result: Wallet | null) => { if (!controller.signal.aborted) { setWallet(result); if (!result) setLoadError(true); } }).catch(() => { if (!controller.signal.aborted) setLoadError(true); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [user?.id,authLoading,revision]);

  const transactions = useMemo(() => (wallet?.recent_transactions || []).filter((item: Transaction) => statusFilter === "all" || item.status.toUpperCase() === statusFilter), [wallet,statusFilter]);

  async function requestTransfer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!bankAccount.trim()) { toast.error("Ingresá el CBU o alias de destino."); return; }
    setSubmitting(true);
    try {
      const response = await fetch("/api/test-email/request-balance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ client: { name: user?.name }, property: { totalArs: wallet?.balances.disponible.ARS, totalUsd: wallet?.balances.disponible.USD, bank_account: bankAccount.trim() } }) });
      if (!response.ok) throw new Error("No se pudo enviar la solicitud");
      toast.success("Solicitud de transferencia enviada."); setIsOpen(false); setBankAccount("");
    } catch { toast.error("No pudimos enviar la solicitud. Intentá nuevamente."); }
    finally { setSubmitting(false); }
  }

  if (loading || authLoading) return <WalletSkeleton />;
  if (loadError || !wallet) return <AccountSectionLayout><div className="rounded-2xl border border-gray-200 bg-white p-8 text-center"><p role="alert" className="text-sm text-gray-600">No pudimos cargar tu billetera.</p><button className={`${button} mt-4 bg-primaryDark text-white`} onClick={()=>setRevision(value=>value+1)}>Reintentar</button></div></AccountSectionLayout>;

  return <AccountSectionLayout>
    <section className="relative isolate mb-5 overflow-hidden rounded-2xl bg-gray-900 text-white"><img src="/fondo.png" alt="" aria-hidden="true" className="absolute inset-0 -z-20 size-full object-cover"/><div className="absolute inset-0 -z-10 bg-gray-950/55"/><div className="flex flex-col gap-5 p-6 sm:p-8 md:flex-row md:items-center md:justify-between"><div><span className="mb-3 inline-flex rounded-xl bg-white/15 p-3"><WalletIcon size={24}/></span><h1 className="text-2xl font-semibold md:text-3xl">Mi Wallet</h1><p className="mt-2 max-w-lg text-sm text-white/85">Gestioná tus pagos, reembolsos y transferencias en ZonaQuintas.</p></div><button onClick={()=>setIsOpen(true)} disabled={wallet.balances.disponible.ARS <= 0 && wallet.balances.disponible.USD <= 0} className={`${button} min-h-12 bg-green-500 px-5 text-gray-950 hover:bg-green-400`}><Send size={16}/>Solicitar transferencia</button></div></section>
    <section aria-label="Resumen de billetera" className="mb-5 grid gap-3 md:grid-cols-3"><BalanceCard title="Saldo retenido" amount={wallet.balances.retenido} description="Se libera cuando corresponde según el estado de la estadía." icon={WalletIcon} color="bg-green-50/80"/><BalanceCard title="Saldo disponible" amount={wallet.balances.disponible} description="Fondos disponibles para solicitar una transferencia." icon={Coins} color="bg-blue-50/80"/><BalanceCard title="Total transferido" amount={wallet.balances.entregado} description="Fondos que ya fueron transferidos a tu cuenta." icon={ArrowLeftRight} color="bg-white"/></section>
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(250px,0.8fr)]">
      <section aria-label="Lista de movimientos" className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 md:p-5"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">Lista de movimientos</h2><label className="relative"><span className="sr-only">Filtrar movimientos</span><select className="min-h-10 appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="all">Todos los movimientos</option><option value="RETENIDO">Retenidos</option><option value="DISPONIBLE">Disponibles</option><option value="ENTREGADO">Transferidos</option></select><ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"/></label></div>
        {transactions.length ? <><div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[540px] text-left text-sm"><caption className="sr-only">Movimientos de tu billetera</caption><thead className="border-y border-gray-100 text-xs text-gray-500"><tr><th scope="col" className="px-3 py-3 font-medium">Fecha</th><th scope="col" className="px-3 py-3 font-medium">Descripción / quinta</th><th scope="col" className="px-3 py-3 font-medium">Monto</th><th scope="col" className="px-3 py-3 font-medium">Estado</th></tr></thead><tbody>{transactions.map((item,i)=><tr key={item.id || `${item.date}-${i}`} className="border-b border-gray-100 last:border-0"><td className="whitespace-nowrap px-3 py-4 text-gray-600">{item.date}</td><td className="px-3 py-4"><p className="font-medium">{item.description || "Movimiento de reserva"}</p><p className="mt-1 text-xs text-gray-500">{item.quinta_name}</p></td><td className="whitespace-nowrap px-3 py-4 font-semibold">{currencyAmount(item.amount,item.currency)}</td><td className="px-3 py-4"><TransactionStatus status={item.status}/></td></tr>)}</tbody></table></div><div className="divide-y divide-gray-100 md:hidden">{transactions.map((item,i)=><article key={item.id || `${item.date}-${i}`} className="space-y-3 py-4 first:pt-1"><div className="flex justify-between gap-3"><div><p className="text-sm font-semibold">{item.quinta_name || "Movimiento de reserva"}</p><p className="mt-1 text-xs text-gray-500">{item.description}</p></div><p className="whitespace-nowrap text-sm font-semibold">{currencyAmount(item.amount,item.currency)}</p></div><div className="flex items-center justify-between"><span className="text-xs text-gray-500">{item.date}</span><TransactionStatus status={item.status}/></div></article>)}</div></> : <div className="rounded-xl bg-gray-50 px-4 py-12 text-center"><ArrowLeftRight size={25} className="mx-auto mb-3 text-gray-400"/><p className="text-sm font-medium text-gray-700">No hay movimientos para mostrar.</p><p className="mt-1 text-xs text-gray-500">Cuando haya actividad, la vas a encontrar acá.</p></div>}
      </section>
      <aside className="space-y-4"><section className="rounded-2xl border border-gray-200 bg-white p-5"><h2 className="flex items-center gap-2 font-semibold"><CalendarDays size={18} className="text-primaryDark"/>Próxima transferencia</h2><p className="mt-4 text-xs text-gray-500">Próxima fecha de pago estimada</p><p className="mt-1 font-medium">{wallet.next_transfer || "Todavía no hay una transferencia programada."}</p><div className="mt-4 flex gap-2 rounded-xl bg-gray-50 p-3 text-xs leading-relaxed text-gray-600"><CircleHelp size={16} className="mt-0.5 shrink-0 text-gray-500"/>El saldo disponible puede solicitarse mediante transferencia a tu cuenta bancaria.</div></section>
        <section className="rounded-2xl border border-gray-200 bg-white p-5"><h2 className="flex items-center gap-2 font-semibold"><Bell size={18} className="text-primaryDark"/>Notificaciones</h2><div className="mt-4 rounded-xl bg-gray-50 p-4 text-center"><p className="text-sm font-medium text-gray-700">No tenés notificaciones nuevas.</p><p className="mt-1 text-xs text-gray-500">Cuando haya informaci?n disponible, la vas a encontrar ac?.</p></div></section></aside>
    </div>
    {isOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4" onMouseDown={e=>{if(e.target===e.currentTarget&&!submitting)setIsOpen(false);}}><section role="dialog" aria-modal="true" aria-labelledby="transfer-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-center justify-between"><h2 id="transfer-title" className="text-xl font-semibold">Solicitar transferencia</h2><button type="button" disabled={submitting} onClick={()=>setIsOpen(false)} aria-label="Cerrar" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X size={19}/></button></div><p className="mt-2 text-sm text-gray-500">Indicá la cuenta donde querés recibir tus fondos.</p><div className="mt-5 space-y-2 rounded-xl bg-gray-50 p-4 text-sm"><p className="flex justify-between gap-4"><span>Disponible en ARS</span><strong>{currencyAmount(wallet.balances.disponible.ARS,"ARS")}</strong></p><p className="flex justify-between gap-4"><span>Disponible en USD</span><strong>{currencyAmount(wallet.balances.disponible.USD,"USD")}</strong></p></div><form onSubmit={requestTransfer} className="mt-5 space-y-4"><label htmlFor="bank-account" className="block text-sm font-medium">CBU o alias</label><input id="bank-account" required autoFocus value={bankAccount} onChange={e=>setBankAccount(e.target.value)} maxLength={100} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primaryDark focus:ring-2 focus:ring-primaryDark/15" placeholder="Ingresá el CBU o alias"/><div className="grid grid-cols-2 gap-3"><button type="button" disabled={submitting} onClick={()=>setIsOpen(false)} className={`${button} border border-gray-200 text-gray-700`}>Cerrar</button><button disabled={submitting} className={`${button} bg-primaryDark text-white hover:bg-green-700`}>{submitting?"Enviando…":"Enviar solicitud"}</button></div></form></section></div>}
  </AccountSectionLayout>;
}
