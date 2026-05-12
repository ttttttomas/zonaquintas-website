import type { Metadata } from "next";
import Header from "./components/Header";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import { FiltersProvider } from "./context/ContextFilters";
import { SearchProvider } from "./context/SearchContext";
import { UserProvider } from "./context/UserContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZonaQuintas | El lugar para disfrutar tus fines de semana",
  description: "Encontrá y reservá la quinta perfecta para tus vacaciones, fines de semana y escapadas. Alquiler de quintas con piscina, áreas verdes y todas las comodidades. ¡Reservá ahora tu próxima aventura!",
  keywords:
    "ZonaQuintas, finde semana, vacaciones, viajes, hotel, apartamento, alquiler, reservas",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <FiltersProvider>
        <SearchProvider>
          <UserProvider>
            <body className={`bg-[#f7f3f0] mt-32 ${inter.className}`}>
              <Toaster position="top-center" />
              <Header />
              {children}
              <Footer />
            </body>
          </UserProvider>
        </SearchProvider>
      </FiltersProvider>
    </html>
  );
}
