"use client";
import { QuintaFormProvider } from "@/app/context/QuintaFormContext";

export default function PublicarQuintaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QuintaFormProvider>{children}</QuintaFormProvider>;
}
