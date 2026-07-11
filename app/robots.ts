import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Bloquear rutas privadas y de API del crawleo
        disallow: [
          "/dashboard",
          "/my-account",
          "/wallet",
          "/reservations",
          "/publications",
          "/favorites",
          "/publicar-quinta/paso-1",
          "/publicar-quinta/paso-2",
          "/publicar-quinta/paso-3",
          "/publicar-quinta/paso-4",
          "/api/",
          "/login",
          "/register",
        ],
      },
    ],
    sitemap: "https://www.zonaquintas.com/sitemap.xml",
    host: "https://www.zonaquintas.com",
  };
}
