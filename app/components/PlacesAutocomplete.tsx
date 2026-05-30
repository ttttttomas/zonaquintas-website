"use client";
import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

/** Extrae el barrio/localidad de los address_components */
function extractNeighborhood(
  components?: google.maps.GeocoderAddressComponent[],
): string {
  if (!components) return "";
  // Orden de prioridad: barrio → sublocality → locality
  const priorities = [
    "neighborhood",
    "sublocality_level_1",
    "sublocality",
    "locality",
  ];
  for (const type of priorities) {
    const comp = components.find((c) => c.types.includes(type));
    if (comp) return comp.long_name;
  }
  return "";
}

type Props = {
  apiKey: string;
  // Te paso el valor al formulario cuando cambia la ubicación
  onLocation?: (data: {
    address: string;
    lat: number;
    lng: number;
    placeId?: string;
    neighborhood?: string;
  }) => void;
  // Centro/zoom inicial (Argentina por defecto)
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
};

export default function PlacesAutocomplete({
  apiKey,
  onLocation,
  initialCenter = { lat: -38.4161, lng: -63.6167 }, // AR
  initialZoom = 4,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null,
  );
  const acRef = useRef<google.maps.places.Autocomplete | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places", "marker"],
      language: "es",
      region: "AR",
    });

    let mounted = true;

    loader.load().then(() => {
      if (!mounted || !mapDivRef.current) return;

      // Mapa base
      mapRef.current = new google.maps.Map(mapDivRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        mapId: "DEMO_MAP",
        disableDefaultUI: false,
      });

      // Marker avanzado (puede ser draggable)
      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: undefined,
        gmpDraggable: true,
      });

      geocoderRef.current = new google.maps.Geocoder();

      // Autocomplete en el input
      if (inputRef.current) {
        acRef.current = new google.maps.places.Autocomplete(inputRef.current, {
          types: ["geocode"],
          componentRestrictions: { country: ["ar"] },
          fields: [
            "formatted_address",
            "geometry",
            "place_id",
            "address_components",
          ],
        });

        acRef.current.addListener("place_changed", () => {
          const place = acRef.current!.getPlace();
          const loc = place.geometry?.location;
          if (!loc) return;

          // Centrar mapa
          if (place.geometry?.viewport) {
            mapRef.current!.fitBounds(place.geometry.viewport);
          } else {
            mapRef.current!.setCenter(loc);
            mapRef.current!.setZoom(16);
          }

          // Mover pin
          markerRef.current!.position = loc;
          console.log("lat", loc.lat());
          console.log("lng", loc.lng());
          onLocation?.({
            address: place.formatted_address ?? inputRef.current!.value,
            lat: loc.lat(),
            lng: loc.lng(),
            placeId: place.place_id,
            neighborhood: extractNeighborhood(place.address_components),
          });
        });
      }

      // Click en el mapa mueve el pin y hace reverse-geocoding (útil si eligen a mano)
      mapRef.current.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        markerRef.current!.position = e.latLng;
        mapRef.current!.panTo(e.latLng);

        geocoderRef
          .current!.geocode({ location: e.latLng })
          .then(({ results }) => {
            const result = results?.[0];
            const addr = result?.formatted_address ?? "";
            if (inputRef.current && addr) inputRef.current.value = addr;
            onLocation?.({
              address: addr,
              lat: e.latLng!.lat(),
              lng: e.latLng!.lng(),
              placeId: result?.place_id,
              neighborhood: extractNeighborhood(result?.address_components),
            });
          })
          .catch(() => {
            onLocation?.({
              address: "",
              lat: e.latLng!.lat(),
              lng: e.latLng!.lng(),
            });
          });
      });

      // Cuando arrastran el pin, también actualizo dirección
      markerRef.current.addListener(
        "dragend",
        (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          geocoderRef
            .current!.geocode({ location: e.latLng })
            .then(({ results }) => {
              const result = results?.[0];
              const addr = result?.formatted_address ?? "";
              if (inputRef.current && addr) inputRef.current.value = addr;
              onLocation?.({
                address: addr,
                lat: e.latLng!.lat(),
                lng: e.latLng!.lng(),
                placeId: result?.place_id,
                neighborhood: extractNeighborhood(result?.address_components),
              });
            });
        },
      );
    });

    return () => {
      mounted = false;
    };
  }, [apiKey, initialCenter, initialZoom, onLocation]);

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        placeholder="Ubica tu quinta en el mapa*"
        className="w-full bg-white border border-gray-300 focus:border-primaryDark focus:ring-2 focus:ring-primaryDark/20 outline-none px-4 py-3 rounded-xl transition duration-200 shadow-sm placeholder:text-gray-400 text-gray-800 font-medium"
        type="text"
      />
      {/* Asegurate de darle altura al contenedor del mapa */}
      <div ref={mapDivRef} className="h-72 w-full rounded-2xl border border-gray-200 shadow-inner" />
    </div>
  );
}
