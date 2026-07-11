import { MetadataRoute } from "next";

const BASE_URL = "https://www.zonaquintas.com";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// Páginas estáticas con su prioridad y frecuencia de cambio
const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/quintas`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/publicar-quinta`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/membership`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/support`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.4,
  },
  {
    url: `${BASE_URL}/politics`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/terms`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Intentar traer todas las quintas activas para generar URLs dinámicas
  try {
    const res = await fetch(`${API_URL}/quintas`, {
      next: { revalidate: 3600 }, // revalidar cada hora
    });

    if (!res.ok) {
      // Si falla la API, devolver solo las rutas estáticas
      return staticRoutes;
    }

    const quintas: Array<{ id: string; status: string; created_at?: string }> =
      await res.json();

    const quintaRoutes: MetadataRoute.Sitemap = quintas
      .filter((q) => q.status === "active")
      .map((q) => ({
        url: `${BASE_URL}/quintas/${q.id}`,
        lastModified: q.created_at ? new Date(q.created_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    return [...staticRoutes, ...quintaRoutes];
  } catch {
    // Si hay cualquier error de red, devolver solo las rutas estáticas
    return staticRoutes;
  }
}
