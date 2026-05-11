'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

type Quinta = {
  id: string | number;
  title: string;
  price: number;
  currency_price?: string;
  city?: string;
  guests?: number;
  bedrooms?: number;
  main_image?: string;
  lat: number;
  lng: number;
};

type Props = {
  listings: Quinta[];
  onMarkerClick?: (id: Quinta['id']) => void;
  mapHeight?: string;
  defaultCenter?: google.maps.LatLngLiteral;
  defaultZoom?: number;
};

export default function QuintasMap({
  listings,
  onMarkerClick,
  mapHeight = '80vh',
  defaultCenter = { lat: -34.6037, lng: -58.3816 },
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
        language: 'es',
        region: 'AR',
      }),
    []
  );

  /** Chip de precio (siempre visible sobre el mapa) */
  function createPriceChip(q: Quinta) {
    const chip = document.createElement('div');
    chip.className = 'price-chip';
    chip.textContent = `${q.currency_price === 'USD' ? 'U$S' : '$'} ${q.price.toLocaleString('es-AR')}`;
    return chip;
  }

  /** Tooltip que aparece al hacer hover */
  function createTooltip(q: Quinta) {
    const tooltip = document.createElement('div');
    tooltip.className = 'map-tooltip';
    tooltip.innerHTML = `
      <div class="map-tooltip-inner">
        ${q.main_image
        ? `<img src="${q.main_image}" alt="${q.title}" class="map-tooltip-img" />`
        : `<div class="map-tooltip-img-placeholder"></div>`
      }
        <div class="map-tooltip-body">
          <p class="map-tooltip-title">${q.title}</p>
          <p class="map-tooltip-city">${q.city ?? ''}</p>
          <div class="map-tooltip-meta">
            ${q.bedrooms != null ? `
              <span class="map-tooltip-meta-item">
                <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 23.333V17.333C4 16.9383 4.11378 16.5179 4.34133 16.0717C4.56889 15.6255 4.89956 15.2903 5.33333 15.0663V11.9997C5.33333 11.2477 5.58978 10.6152 6.10267 10.1023C6.61556 9.58945 7.248 9.33301 8 9.33301H14C14.4596 9.33301 14.852 9.42767 15.1773 9.61701C15.5018 9.80545 15.776 10.0663 16 10.3997C16.224 10.0663 16.4982 9.80545 16.8227 9.61701C17.148 9.42767 17.5404 9.33301 18 9.33301H24C24.752 9.33301 25.3844 9.58945 25.8973 10.1023C26.4102 10.6152 26.6667 11.2477 26.6667 11.9997V15.0663C27.1013 15.2903 27.432 15.6255 27.6587 16.0717C27.8862 16.5179 28 16.9383 28 17.333V23.333C28 23.5223 27.936 23.6806 27.808 23.8077C27.68 23.9348 27.5213 23.9988 27.332 23.9997C27.1427 24.0006 26.9844 23.9366 26.8573 23.8077C26.7302 23.6788 26.6667 23.5206 26.6667 23.333V21.333H5.33333V23.333C5.33333 23.5223 5.26933 23.6806 5.14133 23.8077C5.01333 23.9348 4.85467 23.9988 4.66533 23.9997C4.476 24.0006 4.31778 23.9366 4.19067 23.8077C4.06356 23.6788 4 23.5206 4 23.333ZM16.6667 14.6663H25.3333V11.9997C25.3333 11.6219 25.2053 11.3055 24.9493 11.0503C24.6933 10.7952 24.3769 10.6672 24 10.6663H18C17.6222 10.6663 17.3058 10.7943 17.0507 11.0503C16.7956 11.3063 16.6676 11.6228 16.6667 11.9997V14.6663ZM6.66667 14.6663H15.3333V11.9997C15.3333 11.6219 15.2053 11.3055 14.9493 11.0503C14.6933 10.7952 14.3769 10.6672 14 10.6663H8C7.62222 10.6663 7.30578 10.7943 7.05067 11.0503C6.79556 11.3063 6.66756 11.6228 6.66667 11.9997V14.6663ZM5.33333 19.9997H26.6667V17.333C26.6667 16.9552 26.5387 16.6388 26.2827 16.3837C26.0267 16.1286 25.7102 16.0006 25.3333 15.9997H6.66667C6.28889 15.9997 5.97244 16.1277 5.71733 16.3837C5.46222 16.6397 5.33422 16.9561 5.33333 17.333V19.9997Z" fill="#555"/>
                </svg>
                ${q.bedrooms}
              </span>` : ''}
              $: ${q.currency_price}
            ${q.guests != null ? `
              <span class="map-tooltip-meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4C13.0609 4 14.0783 4.42143 14.8284 5.17157C15.5786 5.92172 16 6.93913 16 8C16 9.06087 15.5786 10.0783 14.8284 10.8284C14.0783 11.5786 13.0609 12 12 12C10.9391 12 9.92172 11.5786 9.17157 10.8284C8.42143 10.0783 8 9.06087 8 8C8 6.93913 8.42143 5.92172 9.17157 5.17157C9.92172 4.42143 10.9391 4 12 4ZM12 14C16.42 14 20 15.79 20 18V20H4V18C4 15.79 7.58 14 12 14Z" fill="#555"/>
                </svg>
                ${q.guests}
              </span>` : ''}
          </div>
          <p class="map-tooltip-price">${q.currency_price === 'USD' ? 'U$S' : '$'} ${q.price.toLocaleString('es-AR')} <span>/noche</span></p>
        </div>
      </div>
      <div class="map-tooltip-arrow"></div>
    `;
    return tooltip;
  }

  useEffect(() => {
    let canceled = false;

    (async () => {
      const { Map } = await loader.importLibrary('maps');
      const { AdvancedMarkerElement } = (await loader.importLibrary(
        'marker'
      )) as google.maps.MarkerLibrary;

      if (canceled) return;

      if (!mapRef.current) {
        mapRef.current = new Map(mapDivRef.current as HTMLElement, {
          center: defaultCenter,
          zoom: defaultZoom,
          mapId: 'DEMO_MAP_ID',
          clickableIcons: false,
          gestureHandling: 'greedy',
          streetViewControl: false,
          mapTypeControl: false,
        });
      }

      const map = mapRef.current!;

      // Limpiar marcadores previos
      markersRef.current.forEach(m => (m.map = null as any));
      markersRef.current = [];
      if (clusterRef.current) {
        clusterRef.current.clearMarkers();
        clusterRef.current = null;
      }

      // Crear marcadores con tooltip
      const newMarkers: google.maps.marker.AdvancedMarkerElement[] = listings.map(q => {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';

        const chip = createPriceChip(q);
        const tooltip = createTooltip(q);

        wrapper.appendChild(tooltip);
        wrapper.appendChild(chip);

        const marker = new AdvancedMarkerElement({
          position: { lat: q.lat, lng: q.lng },
          content: wrapper,
        });

        // Hover: mostrar/ocultar tooltip y escalar chip
        chip.addEventListener('mouseenter', () => {
          chip.classList.add('hover');
          tooltip.classList.add('visible');
        });
        chip.addEventListener('mouseleave', () => {
          chip.classList.remove('hover');
          tooltip.classList.remove('visible');
        });
        // También al hacer hover sobre el tooltip para que no desaparezca
        tooltip.addEventListener('mouseenter', () => {
          tooltip.classList.add('visible');
          chip.classList.add('hover');
        });
        tooltip.addEventListener('mouseleave', () => {
          tooltip.classList.remove('visible');
          chip.classList.remove('hover');
        });

        chip.addEventListener('click', () => onMarkerClick?.(q.id));

        marker.map = map;
        markersRef.current.push(marker);
        return marker;
      });

      clusterRef.current = new MarkerClusterer({ map, markers: newMarkers });

      if (listings.length) {
        const bounds = new google.maps.LatLngBounds();
        listings.forEach(q => bounds.extend({ lat: q.lat, lng: q.lng }));
        map.fitBounds(bounds, 80);
        const z = map.getZoom() ?? 10;
        if (z > 15) map.setZoom(15);
      } else {
        map.setCenter(defaultCenter);
        map.setZoom(defaultZoom);
      }
    })();

    return () => { canceled = true; };
  }, [loader, listings, defaultCenter, defaultZoom, onMarkerClick]);

  return (
    <div style={{ height: mapHeight, width: '100%', position: 'relative' }}>
      <div ref={mapDivRef} style={{ height: '100%', width: '100%' }} />
      <style jsx global>{`
        /* ── Chip de precio ───────────────────────────────── */
        .price-chip {
          font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          font-weight: 700;
          font-size: 13px;
          line-height: 1;
          padding: 8px 12px;
          border-radius: 20px;
          background: #28a728;
          border: 2px solid rgba(255,255,255,0.9);
          box-shadow: 0 2px 6px rgba(0,0,0,0.18), 0 4px 14px rgba(0,0,0,0.10);
          color: #fff;
          cursor: pointer;
          user-select: none;
          transition: box-shadow .15s ease, transform .15s ease, background .15s ease;
          white-space: nowrap;
          position: relative;
          z-index: 1;
        }
        .price-chip.hover {
          background: #1d7e1d;
          transform: scale(1.06);
          box-shadow: 0 4px 12px rgba(0,0,0,0.22), 0 10px 24px rgba(0,0,0,0.14);
        }

        /* ── Tooltip ──────────────────────────────────────── */
        .map-tooltip {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          width: 220px;
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          transition: opacity .18s ease, transform .18s ease, visibility .18s;
          transform: translateX(-50%) translateY(6px);
          z-index: 10;
        }
        .map-tooltip.visible {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }
        .map-tooltip-inner {
          background: #fff;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10);
          border: 1px solid rgba(0,0,0,0.06);
        }
        .map-tooltip-img {
          width: 100%;
          height: 110px;
          object-fit: cover;
          display: block;
        }
        .map-tooltip-img-placeholder {
          width: 100%;
          height: 80px;
          background: #f0f0f0;
        }
        .map-tooltip-body {
          padding: 10px 12px 10px;
        }
        .map-tooltip-title {
          font-family: system-ui, sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #111;
          margin: 0 0 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .map-tooltip-city {
          font-family: system-ui, sans-serif;
          font-size: 11px;
          color: #888;
          margin: 0 0 6px;
        }
        .map-tooltip-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #555;
          margin-bottom: 6px;
          font-family: system-ui, sans-serif;
        }
        .map-tooltip-meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
        }
        .map-tooltip-price {
          font-family: system-ui, sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #28a728;
          margin: 0;
        }
        .map-tooltip-price span {
          font-weight: 400;
          color: #999;
          font-size: 11px;
        }
        /* Flecha del tooltip */
        .map-tooltip-arrow {
          width: 12px;
          height: 7px;
          background: #fff;
          clip-path: polygon(0 0, 100% 0, 50% 100%);
          margin: 0 auto;
          filter: drop-shadow(0 2px 2px rgba(0,0,0,0.08));
        }
      `}</style>
    </div>
  );
}
