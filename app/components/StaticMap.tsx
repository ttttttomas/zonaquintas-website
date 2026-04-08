"use client";
import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

type Props = {
  lat: number;
  lng: number;
  zoom?: number;
};

export default function StaticMap({ lat, lng, zoom = 15 }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const parsedLat = Number(lat);
  const parsedLng = Number(lng);

  useEffect(() => {
    if (!mapRef.current || isNaN(parsedLat) || isNaN(parsedLng)) return;

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
      libraries: ["marker"],
      language: "es",
      region: "AR",
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      const center = { lat: parsedLat, lng: parsedLng };

      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapId: "DEMO_MAP",
        disableDefaultUI: false,
        gestureHandling: "cooperative",
      });

      new google.maps.marker.AdvancedMarkerElement({
        map,
        position: center,
      });
    });
  }, [parsedLat, parsedLng, zoom]);

  return <div ref={mapRef} className="w-full h-[400px] rounded-xl border" />;
}
