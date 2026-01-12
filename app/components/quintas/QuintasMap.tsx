'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

type Quinta = {
  id: string | number;
  title: string;
  price: number;     // mostrás lo que quieras
  lat: number;
  lng: number;
};

type Props = {
  listings: Quinta[];                           // quintas filtradas
  onMarkerClick?: (id: Quinta['id']) => void;   // callback al click
  mapHeight?: string;
  defaultCenter?: google.maps.LatLngLiteral;    // por si no hay resultados
  defaultZoom?: number;
};

export default function QuintasMap({
  listings,
  onMarkerClick,
  mapHeight = '80vh',
  defaultCenter = { lat: -34.6037, lng: -58.3816 }, // CABA
  defaultZoom = 11,
}: Props) {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map>(null);
  const clusterRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const loader = useMemo(
    () =>
      new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: 'weekly',
        libraries: ['marker'],
      }),
    []
  );

  // crea el “chip” HTML del precio
  function createPriceChip(priceText: string) {
    const el = document.createElement('div');
    el.className = 'price-chip';
    el.textContent = priceText;
    return el;
  }

  // monta / actualiza mapa y marcadores
  useEffect(() => {
    let canceled = false;

    (async () => {
      const { Map } = await loader.importLibrary('maps');
      const { AdvancedMarkerElement } = (await loader.importLibrary(
        'marker'
      )) as google.maps.MarkerLibrary;

      if (canceled) return;

      // init map una sola vez
      if (!mapRef.current) {
        mapRef.current = new Map(mapDivRef.current as HTMLElement, {
          center: defaultCenter,
          zoom: defaultZoom,
          mapId: 'DEMO_MAP_ID', // opcional (si tenés map styles vector)
          clickableIcons: false,
          gestureHandling: 'greedy',
          streetViewControl: false,
          mapTypeControl: false,
        });
      }

      const map = mapRef.current!;

      // limpiar marcadores previos
      markersRef.current.forEach(m => m.map = null as any);
      markersRef.current = [];
      if (clusterRef.current) {
        clusterRef.current.clearMarkers();
        clusterRef.current = null;
      }

      // crear marcadores
      const newMarkers: google.maps.marker.AdvancedMarkerElement[] = listings.map(q => {
        const chip = createPriceChip(`$${q.price}`);
        const marker = new AdvancedMarkerElement({
          position: { lat: q.lat, lng: q.lng },
          content: chip,
          // zIndex: según precio o foco si querés
        });

        chip.addEventListener('click', () => onMarkerClick?.(q.id));
        chip.addEventListener('mouseenter', () => chip.classList.add('hover'));
        chip.addEventListener('mouseleave', () => chip.classList.remove('hover'));

        marker.map = map;
        markersRef.current.push(marker);
        return marker;
      });

      // cluster (opcional)
      clusterRef.current = new MarkerClusterer({
        map,
        markers: newMarkers,
        // renderer custom si querés, default ya sirve
      });

      // fit bounds a resultados (si hay)
      if (listings.length) {
        const bounds = new google.maps.LatLngBounds();
        listings.forEach(q => bounds.extend({ lat: q.lat, lng: q.lng }));
        map.fitBounds(bounds, 80); // padding
        // si el zoom quedó demasiado cerca/lejos, podés normalizar:
        const z = map.getZoom() ?? 10;
        if (z > 15) map.setZoom(15);
      } else {
        // sin resultados => centro por defecto
        map.setCenter(defaultCenter);
        map.setZoom(defaultZoom);
      }
    })();

    return () => {
      canceled = true;
    };
  }, [loader, listings, defaultCenter, defaultZoom, onMarkerClick]);

  return (
    <div style={{ height: mapHeight, width: '100%', position: 'relative' }}>
      <div ref={mapDivRef} style={{ height: '100%', width: '100%' }} />
      <style jsx global>{`
        .price-chip {
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
          font-weight: 700;
          font-size: 12px;
          line-height: 1;
          padding: 8px 10px;
          border-radius: 16px;
          background: #28a728;
          border: 1px solid rgba(0,0,0,0.15);
          box-shadow: 0 1px 2px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
          color: #fff;
          transform: translateY(-4px);
          cursor: pointer;
          user-select: none;
          transition: box-shadow .15s ease, transform .15s ease;
          white-space: nowrap;
        }
        .price-chip.hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 4px 10px rgba(0,0,0,0.18), 0 12px 24px rgba(0,0,0,0.12);
        }
      `}</style>
    </div>
  );
}
