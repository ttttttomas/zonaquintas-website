import type { Metadata } from "next";
import Header from "./components/Header";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import { FiltersProvider } from "./context/ContextFilters";
import { SearchProvider } from "./context/SearchContext";
import { UserProvider } from "./context/UserContext";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZonaQuintas | El lugar para disfrutar tus fines de semana",
  description: "Encontrá y reservá la quinta perfecta para tus vacaciones, fines de semana y escapadas. Alquiler de quintas con piscina, áreas verdes y todas las comodidades. ¡Reservá ahora tu próxima aventura!",
  keywords: [
    // Marca
    "ZonaQuintas",
    "zona quintas",
    // Core — producto principal
    "alquiler de quintas",
    "alquilar mi quinta",
    "quintas para eventos",
    "alquiler quintas Argentina",
    "quintas para alquilar",
    "quintas por fin de semana",
    "alquiler quinta fin de semana",
    "alquiler quinta temporario",
    "quinta de fin de semana",
    "alquiler casas de campo",
    // Ocasiones / intención
    "escapadas de fin de semana",
    "finde de semana en quinta",
    "vacaciones en quinta",
    "alquiler para cumpleaños",
    "alquiler para eventos familiares",
    "casas para alquilar con pileta",
    "casas para alquilar con parrilla",
    // Amenities buscados frecuentemente
    "quinta con piscina",
    "quinta con pileta",
    "quinta con parrilla",
    "quinta con jacuzzi",
    "quinta con cancha de fútbol",
    "quinta con cancha de pádel",
    "quinta pet friendly",
    "quinta acepta mascotas",
    // Tipo de huésped / uso
    "alquiler grupal casa de campo",
    "casas rurales Argentina",
    "turismo rural Argentina",
    // Long-tail geográficos
    "quintas en Buenos Aires",
    "quintas en GBA",
    "quintas en Córdoba",
    "quintas en Entre Ríos",
    // Genéricos de la categoría
    "alojamiento rural",
    "casa de campo alquiler",
    "reserva online quinta",
  ],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

const META_PIXEL_ID = "1713121929685672";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <Script id="gtm-head" strategy="beforeInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MC25527K');
          `}
        </Script>
      </head>
      <FiltersProvider>
        <SearchProvider>
          <UserProvider>
            <body className={`bg-[#f7f3f0] mt-32 ${inter.className}`}>
              <noscript>
                <img
                  height="1"
                  width="1"
                  style={{ display: "none" }}
                  src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                  alt=""
                />
              </noscript>
              <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-1V563PGQMG"
                strategy="afterInteractive"
              />

              <Script id="gtag-init" strategy="afterInteractive">
                {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-1V563PGQMG');
      `}
              </Script>
              <noscript>
                <iframe
                  src="https://www.googletagmanager.com/ns.html?id=GTM-MC25527K"
                  height="0"
                  width="0"
                  style={{ display: "none", visibility: "hidden" }}
                />
              </noscript>
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
