"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { defaultFilters, useFilters } from "@/app/context/ContextFilters";
import { Search, X } from "lucide-react";

const PRICE_PRESETS = [
  { label: "Hasta $100.000", range: [0, 100_000] },
  { label: "$100.000 – $250.000", range: [100_000, 250_000] },
  { label: "$250.000 – $500.000", range: [250_000, 500_000] },
  { label: "Más de $500.000", range: [500_000, 5_000_000] },
] as const;

// ---------- Simple SVG icons (sin dependencias) ----------
const IconWifi = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M12 20a2 2 0 1 0 0-4a2 2 0 0 0 0 4m6-5a10 10 0 0 0-12 0l-1.5-1.34a12 12 0 0 1 15 0zm3-3a16 16 0 0 0-18 0L1.5 9.66a18 18 0 0 1 21 0z"
    />
  </svg>
);
const IconBroom = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="m16.5 2.5l5 5l-2 2l-5-5zm-2.79 3.21l4.58 4.58L8 21H3v-5z"
    />
  </svg>
);
const IconTv = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M21 17H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1M3 6v10h18V6zm7 15v-2h4v2z"
    />
  </svg>
);
const IconGame = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M6 7h12a4 4 0 0 1 4 4v3a4 4 0 0 1-4 4h-1l-2-2h-6l-2 2H6a4 4 0 0 1-4-4v-3a4 4 0 0 1 4-4m3 4H7v2H5v2h2v2h2v-2h2v-2H9zm7 1.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3"
    />
  </svg>
);
const IconDryer = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M4 3h10a5 5 0 0 1 0 10H9v6H7V5H4zm12 2a3 3 0 1 0 0 6a3 3 0 0 0 0-6m3 4h3v2h-3zm-1 4h4v2h-4z"
    />
  </svg>
);
const IconFreezer = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m0 2v6h10V4zm0 8v8h10v-8zM8 6h2v2H8zm0 10h2v2H8z"
    />
  </svg>
);
const IconParking = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M4 3h8a5 5 0 0 1 0 10H8v8H4zM8 7v2h4a1 1 0 0 0 0-2z"
    />
  </svg>
);
const IconGrill = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M4 3h16v2H4zm1 4h14a6 6 0 0 1-6 5.91V16h3v2H8v-2h3v-3.09A6 6 0 0 1 5 7m2 0a4 4 0 0 0 8 0z"
    />
  </svg>
);
const IconSoccer = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2m-3 6l-2 3l2 2l3-1l1-3l-2-2zm6 0l-2 2l1 3l3 1l2-2l-2-3zm-9 5l1 3l3 2l1-2l-2-2zm12 0l-3 1l-1 2l3-2zm-6 2l-2 1l2 3l2-3z"
    />
  </svg>
);
const IconTennis = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M12 2a10 10 0 0 0 0 20a8 8 0 0 1 0-20m2 0a8 8 0 0 1 0 20a10 10 0 0 0 0-20"
    />
  </svg>
);
const IconChip = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M8 4h8v2h2v2h2v8h-2v2h-2v2H8v-2H6v-2H4V8h2V6h2zM8 8v8h8V8z"
    />
  </svg>
);
const IconBed = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M4 7h8a3 3 0 0 1 3 3v2h5v5h-2v-2H6v2H4zM6 9v3h7v-1a2 2 0 0 0-2-2z"
    />
  </svg>
);
const IconSofa = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M3 11a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v5h-2v2h-2v-2H7v2H5v-2H3zm2 0v3h14v-3a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1"
    />
  </svg>
);
const IconToilet = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M7 3h10v2H7zm0 4h10v6a5 5 0 0 1-5 5H7zm-2 8h4a7 7 0 0 0 14 0h-4a3 3 0 0 1-6 0H5z"
    />
  </svg>
);
const IconSettings = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="m12 2l2 2l3-.5l1 2.5l2.5 1l-.5 3l2 2l-2 2l.5 3l-2.5 1l-1 2.5l-3-.5l-2 2l-2-2l-3 .5l-1-2.5l-2.5-1l.5-3l-2-2l2-2l-.5-3l2.5-1l1-2.5l3 .5zM8 12a4 4 0 1 0 8 0a4 4 0 0 0-8 0"
    />
  </svg>
);
const IconAC = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M6.59 1L3 4.59L4.41 6L8 2.41zM4.5 10.5v-2h-3v2zm15-9L16 5l1.41 1.41L21 2.82zM20.5 10.5v-2h3v2zM8 18l-4 4l1.41 1.41L9 19.82zM18 18l-1.41 1.41L21 23l1.41-1.41zM12 6a6 6 0 0 1 6 6a6 6 0 0 1-6 6a6 6 0 0 1-6-6a6 6 0 0 1 6-6m0 2a4 4 0 0 0-4 4a4 4 0 0 0 4 4a4 4 0 0 0 4-4a4 4 0 0 0-4-4"
    />
  </svg>
);
const IconFirstAid = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2M10 4h4v2h-4zm3 11h-2v2H9v-2H7v-2h2v-2h2v2h2z"
    />
  </svg>
);
const IconCable = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M17 7h-4v2h4v2h-4v2h4v2l4-4zm-7 2H6v2h4v2H6v2H2l4-4zm7-4c1.11 0 2-.89 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2c0 1.11.89 2 2 2M7 3a2 2 0 0 0-2 2c0 1.11.89 2 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m10 18a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2c0 1.11.89 2 2 2M7 17a2 2 0 0 0-2 2c0 1.11.89 2 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2"
    />
  </svg>
);
const IconKitchen = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M18 2.01L6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-1.99M18 20H6v-9.02h12zm0-11H6V4h12zM8 5h2v3H8zm0 7h2v5H8z"
    />
  </svg>
);
const IconUtensils = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66zm6.78-1.81c1.53.71 3.68.21 5.27-1.38c1.91-1.91 2.28-4.65.81-6.12c-1.46-1.46-4.2-1.1-6.12.81c-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88l1.41-1.41L13.41 13z"
    />
  </svg>
);
const IconFireplace = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M2 2v20h20V2zm10 17.5c-2.5 0-4.5-2-4.5-4.5c0-1.38.62-2.5 1.38-3.41c.47-.56 1-.97 1.62-1.36c.41 1.09 1.16 2 2.5 2.5c0 .5.5 1 1 1.5c.36.36.5.64.5 1.27c0 1.93-1.57 3.5-3.5 3.5M20 20h-2v-2h-2.03c.59-.8.97-1.76 1.03-2.8c.03-.64-.12-1.28-.5-1.91l-.5-.75c-.32.5-.67.86-1 1.16V4H4v16H2V2h20z"
    />
  </svg>
);
const IconPool = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M22 21c-1.11 0-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36c-.56 0-.78.13-1.15.36c-.46.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36c-.56 0-.78.13-1.15.36c-.46.27-1.08.64-2.19.64c-1.11 0-1.73-.37-2.18-.64c-.37-.23-.6-.36-1.15-.36s-.78.13-1.15.36c-.46.27-1.08.64-2.19.64v-2c.56 0 .78-.13 1.15-.36c.46-.27 1.08-.64 2.19-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36c.56 0 .78-.13 1.15-.36c.46-.27 1.08-.64 2.19-.64c1.11 0 1.73.37 2.18.64c.37.22.6.36 1.15.36s.78-.13 1.15-.36c.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36v2m0-4.5c-1.11 0-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36c-.56 0-.78.13-1.15.36c-.46.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36c-.56 0-.78.13-1.15.36c-.46.27-1.08.64-2.19.64c-1.11 0-1.73-.37-2.18-.64c-.37-.23-.6-.36-1.15-.36s-.78.13-1.15.36c-.46.27-1.08.64-2.19.64v-2c.56 0 .78-.13 1.15-.36c.46-.27 1.08-.64 2.19-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36c.56 0 .78-.13 1.15-.36c.46-.27 1.08-.64 2.19-.64c1.11 0 1.73.37 2.18.64c.37.22.6.36 1.15.36s.78-.13 1.15-.36c.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36v2M8.67 12c.19-.73.55-1.6 1.23-2.5c.78-1.04 1.85-1.86 3.11-2.32c-.53 1.12-.92 2.45-.92 3.83c0 .11 0 .23.03.33c.03.11.06.22.1.33c.58-.21 1.21-.32 1.85-.32c2.61 0 4.77 1.67 5.61 4H8.67m8.33 0c0-1.38-1.12-2.5-2.5-2.5S12 10.62 12 12z"
    />
  </svg>
);
const IconJacuzzi = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M7 6c.55 0 1-.45 1-1s-.45-1-1-1s-1 .45-1 1s.45 1 1 1m3-3c.55 0 1-.45 1-1s-.45-1-1-1s-1 .45-1 1s.45 1 1 1m-3 0c.55 0 1-.45 1-1s-.45-1-1-1s-1 .45-1 1s.45 1 1 1m10 6.23c-.36-.11-.69-.28-1-.47V6c0-1.1-.9-2-2-2h-1c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2H5c-1.1 0-1.99.9-1.99 2v3.8c-.35.14-.64.34-.87.58c-.67.7-1.14 1.67-1.14 2.82V22h1.5v-6H21v6h1.5v-8.8c0-1.16-.47-2.12-1.14-2.82c-.23-.24-.52-.44-.87-.58V9.23c-.36.19-.69.36-1.05.47c-.53.17-1.03.3-1.58.3c-.55 0-1.05-.13-1.58-.3c-.53-.17-1-.44-1.36-.77c-.37.33-.83.6-1.36.77c-.53.17-1.03.3-1.58.3s-1.06-.13-1.58-.3M13 6c.55 0 1-.45 1-1s-.45-1-1-1s-1 .45-1 1s.45 1 1 1"
    />
  </svg>
);
const IconToys = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M12 2a3 3 0 0 0-3 3c0 .73.27 1.4.71 1.92c-.55.19-1.04.5-1.43.9L4.5 4.04a1.5 1.5 0 0 0-2.12 0a1.5 1.5 0 0 0 0 2.12l3.78 3.78c-.4.39-.71.88-.9 1.43A2.99 2.99 0 0 0 3.34 12a3 3 0 0 0 3 3c.73 0 1.4-.27 1.92-.71c.19.55.5 1.04.9 1.43l-3.78 3.78a1.5 1.5 0 0 0 0 2.12a1.5 1.5 0 0 0 2.12 0l3.78-3.78c.39.4.88.71 1.43.9c-.44.52-.71 1.19-.71 1.92a3 3 0 0 0 3 3a3 3 0 0 0 3-3c0-.73-.27-1.4-.71-1.92c.55-.19 1.04-.5 1.43-.9l3.78 3.78a1.5 1.5 0 0 0 2.12 0a1.5 1.5 0 0 0 0-2.12l-3.78-3.78c.4-.39.71-.88.9-1.43c.52.44 1.19.71 1.92.71a3 3 0 0 0 3-3a3 3 0 0 0-3-3c-.73 0-1.4.27-1.92.71c-.19-.55-.5-1.04-.9-1.43l3.78-3.78a1.5 1.5 0 0 0 0-2.12a1.5 1.5 0 0 0-2.12 0l-3.78 3.78c-.39-.4-.88-.71-1.43-.9c.44-.52.71-1.19.71-1.92A3 3 0 0 0 12 2m0 5a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
    />
  </svg>
);
const IconWasher = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2M6 4h12v2H6zm6 16a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m2.55-6.45c-.07-.2-.17-.39-.31-.56c-.13-.17-.29-.3-.48-.4c-.18-.1-.39-.15-.62-.15c-.18 0-.36.03-.53.08s-.32.14-.46.24c-.14.11-.25.23-.34.39c-.09.15-.14.33-.16.53h-.84c.02-.31.09-.59.21-.84s.29-.46.51-.64c.21-.18.46-.32.74-.42s.58-.15.89-.15c.29 0 .57.04.84.13c.27.09.5.22.71.39c.21.17.37.38.5.63c.13.25.19.54.19.86c0 .21-.03.41-.09.61s-.14.37-.25.53c-.11.16-.24.3-.39.43c-.15.13-.31.24-.48.33c-.11.06-.22.13-.32.2c-.1.08-.19.16-.26.25s-.13.19-.17.29c-.04.11-.06.23-.06.36v.23h-.84l-.01-.22c0-.23.03-.43.09-.61m-.55 3.45v-1h1v1z"
    />
  </svg>
);
const IconBlanket = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2M8 20H4v-4h4zm0-6H4v-4h4zm0-6H4V4h4zm6 12h-4v-4h4zm0-6h-4v-4h4zm0-6h-4V4h4zm6 12h-4v-4h4zm0-6h-4v-4h4zm0-6h-4V4h4z"
    />
  </svg>
);
const IconBedding = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M19 7h-8v6h10V9a2 2 0 0 0-2-2M5 13h4V7H7a2 2 0 0 0-2 2m-2 8h18v-2H3m0-2h18v-2H3z"
    />
  </svg>
);
const IconSheets = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2m11 2h5v5h-5zm0 7h5v5h-5zM5 7h7v10H5z"
    />
  </svg>
);
const IconTowel = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M16 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2m-4 2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m4 16H8v-2h8zm0-4H8v-2h8zm0-4H8V8h8z"
    />
  </svg>
);
const IconDishes = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M12 2a9 9 0 0 0-9 9c0 3.5 2 6.5 5 8v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2c3-1.5 5-4.5 5-8a9 9 0 0 0-9-9m0 2c3.86 0 7 3.14 7 7c0 2.88-1.77 5.36-4.27 6.42c-.2.09-.35.25-.42.45L14 19H10l-.31-1.13c-.07-.2-.22-.36-.42-.45A7.003 7.003 0 0 1 5 11c0-3.86 3.14-7 7-7m0 2a5 5 0 0 0-5 5h2a3 3 0 0 1 3-3z"
    />
  </svg>
);
const IconPet = (p: any) => (
  <svg viewBox="0 0 24 24" className={p.className}>
    <path
      fill="currentColor"
      d="M4.5 12a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m4-4a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m7 0a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m4 4a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3M12 18c-1.26 0-2.1-.59-2.72-1.22A3.5 3.5 0 0 0 6 15c-.58 0-1.14.12-1.66.34A7.46 7.46 0 0 1 4 14c0-2.5 3.58-5 8-5s8 2.5 8 5c0 .44-.12.86-.34 1.34c-.52-.22-1.08-.34-1.66-.34a3.5 3.5 0 0 0-3.28 1.78C14.1 17.41 13.26 18 12 18"
    />
  </svg>
);

// ---------- Subcomponentes ----------
function Chip({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-pressed={active}
      className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaryDark ${active ? "border-primaryDark bg-green-50 text-primaryDark" : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"}`}>
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );
}

function Stepper({ value, setValue, label }: {
  value: number;
  setValue: (v: number) => void;
  label: string;
}) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-full border border-gray-300 bg-white">
      <button
        type="button"
        disabled={value <= 0}
        className="h-11 w-11 text-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40"
        onClick={() => setValue(Math.max(0, value - 1))}
        aria-label={`Restar ${label}`}>
        –
      </button>
      <div className="w-10 select-none text-center text-sm font-medium text-gray-900" aria-live="polite">
        {value}
      </div>
      <button
        type="button"
        disabled={value >= 30}
        className="h-11 w-11 text-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40"
        onClick={() => setValue(value + 1)}
        aria-label={`Sumar ${label}`}>
        +
      </button>
    </div>
  );
}

// ---------- Componente principal ----------
export default function FiltrosInmuebles({
  handleClick,
}: {
  handleClick: () => void;
}) {
  const { filters, setFilters } = useFilters();
  const [draftFilters, setDraftFilters] = useState<any>(() => ({
    ...filters,
    priceRange: [...filters.priceRange],
  }));
  const [priceRange, setPriceRange] = useState<[number, number]>(draftFilters.priceRange);
  const [featureSearch, setFeatureSearch] = useState("");
  const closeRef = useRef(handleClick);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  closeRef.current = handleClick;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus());
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      cancelAnimationFrame(focusFrame);
    };
  }, []);

  const fmt = (n: number) =>
    n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  const featureList = useMemo(
    () => [
      // Habitaciones
      { key: "sabanas", label: "Sábanas", icon: <IconSheets className="h-5 w-5" /> },
      { key: "mantas", label: "Mantas", icon: <IconBlanket className="h-5 w-5" /> },
      { key: "almohadas", label: "Almohadas", icon: <IconBedding className="h-5 w-5" /> },
      // Limpieza personal
      { key: "toilettes", label: "Toilettes", icon: <IconToilet className="h-5 w-5" /> },
      { key: "shampoo", label: "Shampoo", icon: <IconSettings className="h-5 w-5" /> },
      { key: "toallas", label: "Toallas", icon: <IconTowel className="h-5 w-5" /> },
      { key: "secador_pelo", label: "Secador de pelo", icon: <IconDryer className="h-5 w-5" /> },
      // Limpieza general
      { key: "lavarropas", label: "Lavarropas", icon: <IconWasher className="h-5 w-5" /> },
      { key: "cambio_toallas", label: "Cambio de toallas", icon: <IconBroom className="h-5 w-5" /> },
      // Cocina
      { key: "utensillos_cocina", label: "Utensillos de cocina", icon: <IconUtensils className="h-5 w-5" /> },
      { key: "vajilla", label: "Vajilla", icon: <IconDishes className="h-5 w-5" /> },
      { key: "freezer", label: "Heladera / Freezer", icon: <IconFreezer className="h-5 w-5" /> },
      // Entretenimiento
      { key: "televisor", label: "Televisor", icon: <IconTv className="h-5 w-5" /> },
      { key: "radio", label: "Radio", icon: <IconChip className="h-5 w-5" /> },
      { key: "tv", label: "Smart TV", icon: <IconTv className="h-5 w-5" /> },
      { key: "cable", label: "TV por Cable", icon: <IconCable className="h-5 w-5" /> },
      { key: "internet", label: "WiFi / Internet", icon: <IconWifi className="h-5 w-5" /> },
      { key: "jacuzzi", label: "Jacuzzi", icon: <IconJacuzzi className="h-5 w-5" /> },
      { key: "playroom", label: "Sala de Juegos", icon: <IconGame className="h-5 w-5" /> },
      { key: "sofas", label: "Sofás", icon: <IconSofa className="h-5 w-5" /> },
      // Estacionamiento
      { key: "estacionamiento_techado", label: "Estacionamiento techado", icon: <IconParking className="h-5 w-5" /> },
      // Otras características
      { key: "parrilla", label: "Parrilla", icon: <IconGrill className="h-5 w-5" /> },
      { key: "estufa_gas", label: "Estufa a gas", icon: <IconFireplace className="h-5 w-5" /> },
      { key: "hogar", label: "Hogar / Chimenea", icon: <IconFireplace className="h-5 w-5" /> },
      { key: "hamacas_paraguayas", label: "Hamacas paraguayas", icon: <IconSofa className="h-5 w-5" /> },
      { key: "arboleda", label: "Arboleda con sombra", icon: <IconChip className="h-5 w-5" /> },
      { key: "cancha_futbol", label: "Cancha de fútbol", icon: <IconSoccer className="h-5 w-5" /> },
      { key: "piscina", label: "Piscina", icon: <IconPool className="h-5 w-5" /> },
      { key: "pet", label: "Pet Friendly", icon: <IconPet className="h-5 w-5" /> },
      { key: "cancha_basquet", label: "Cancha de básquet", icon: <IconChip className="h-5 w-5" /> },
      { key: "cancha_tenis", label: "Cancha de tenis", icon: <IconTennis className="h-5 w-5" /> },
      { key: "cancha_padel", label: "Cancha de pádel", icon: <IconTennis className="h-5 w-5" /> },
      { key: "hamacas", label: "Hamacas", icon: <IconSofa className="h-5 w-5" /> },
      { key: "parlantes", label: "Parlantes", icon: <IconChip className="h-5 w-5" /> },
    ],
    []
  );

  const toggleFeature = (key: string) => {
    setDraftFilters((prev: any) => ({
      ...prev,
      [key]: prev[key] === true ? null : true,
    }));
  };

  const visibleFeatures = featureList.filter((feature) =>
    feature.label.toLocaleLowerCase("es").includes(featureSearch.trim().toLocaleLowerCase("es"))
  );
  const selectedFeatureCount = featureList.filter((feature) => draftFilters[feature.key] === true).length;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      onMouseDown={(event) => { if (event.target === event.currentTarget) handleClick(); }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="all-filters-title"
        ref={dialogRef}
        className="relative flex h-[min(92dvh,900px)] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-white text-gray-900 shadow-2xl sm:h-[min(88dvh,900px)] sm:rounded-2xl"
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])');
          if (!focusable?.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-8">
          <div>
            <h2 id="all-filters-title" className="text-xl font-semibold sm:text-2xl">Todos los filtros</h2>
            <p className="mt-1 text-sm text-gray-500">Elegí qué necesitás para tu estadía.</p>
          </div>
          <button ref={closeButtonRef} type="button" onClick={handleClick} aria-label="Cerrar filtros" className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaryDark">
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6 sm:px-8">
          <section aria-labelledby="price-filter-title" className="rounded-2xl border border-gray-200 p-5 sm:p-6">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div><h3 id="price-filter-title" className="font-semibold">Precio por noche</h3><p className="mt-1 text-sm text-gray-500">Definí un rango para tu búsqueda.</p></div>
              <p className="text-sm font-medium text-gray-700">{fmt(priceRange[0])} — {fmt(priceRange[1])}</p>
            </div>
            <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Rangos de precio sugeridos">
              {PRICE_PRESETS.map(({ label, range }) => {
                const selected = priceRange[0] === range[0] && priceRange[1] === range[1];
                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setPriceRange([...range])}
                    className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaryDark ${selected ? "border-primaryDark bg-primaryDark/5 text-primaryDark" : "border-gray-300 text-gray-700 hover:border-gray-500 hover:bg-gray-50"}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="px-2 pb-2">
              <Slider
                range min={0} max={5000000} step={10000} value={priceRange}
                onChange={(value) => setPriceRange(value as [number, number])}
                allowCross={false} pushable={0}
                trackStyle={[{ backgroundColor: "var(--color-primaryDark)", height: 6 }]}
                railStyle={{ backgroundColor: "var(--color-gray-200)", height: 6 }}
                handleStyle={[
                  { borderColor: "var(--color-primaryDark)", backgroundColor: "white", width: 22, height: 22, opacity: 1 },
                  { borderColor: "var(--color-primaryDark)", backgroundColor: "white", width: 22, height: 22, opacity: 1 },
                ]}
              />
            </div>
          </section>

          <section aria-labelledby="basic-filter-title">
            <div className="mb-4"><h3 id="basic-filter-title" className="font-semibold">Ambientes y espacios</h3><p className="mt-1 text-sm text-gray-500">Indicá la cantidad mínima que necesitás.</p></div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { key: "bedrooms", label: "Habitaciones", icon: <IconBed className="h-5 w-5 text-gray-500" /> },
                { key: "amb", label: "Ambientes", icon: <IconSofa className="h-5 w-5 text-gray-500" /> },
                { key: "bathrooms", label: "Baños", icon: <IconToilet className="h-5 w-5 text-gray-500" /> },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 p-4">
                  <div className="flex min-w-0 items-center gap-3">{item.icon}<span className="text-sm font-medium">{item.label}</span></div>
                  <Stepper label={item.label.toLocaleLowerCase("es")} value={draftFilters[item.key]} setValue={(value: number) => setDraftFilters((previous: any) => ({ ...previous, [item.key]: value }))} />
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="amenities-title">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div><h3 id="amenities-title" className="font-semibold">Servicios y comodidades</h3><p className="mt-1 text-sm text-gray-500">Podés elegir más de una opción.</p></div>
              <span className="text-sm text-gray-500">{selectedFeatureCount} seleccionados</span>
            </div>
            <label className="mb-4 flex min-h-11 items-center gap-2 rounded-xl border border-gray-300 px-3 focus-within:border-primaryDark focus-within:ring-2 focus-within:ring-primaryDark/20">
              <Search size={18} className="shrink-0 text-gray-400" aria-hidden="true" />
              <span className="sr-only">Buscar servicios</span>
              <input value={featureSearch} onChange={event => setFeatureSearch(event.target.value)} placeholder="Buscar un servicio" className="w-full bg-transparent text-sm outline-none focus-visible:outline-2 focus-visible:outline-primaryDark placeholder:text-gray-400" />
            </label>
            {visibleFeatures.length ? <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{visibleFeatures.map(feature => (
              <Chip key={feature.key} active={draftFilters[feature.key] === true} onClick={() => toggleFeature(feature.key)} icon={feature.icon} label={feature.label} />
            ))}</div> : <p className="rounded-xl bg-gray-50 py-8 text-center text-sm text-gray-500">No encontramos servicios con ese nombre.</p>}
          </section>
        </div>

        <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <button type="button" onClick={() => { setDraftFilters({ ...defaultFilters, priceRange: [...defaultFilters.priceRange] }); setPriceRange([0, 5000000]); setFeatureSearch(""); }} className="min-h-11 rounded-xl px-4 text-sm font-medium text-gray-700 underline underline-offset-4 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaryDark">Limpiar filtros</button>
          <button type="button" onClick={() => { setFilters((previous: any) => ({ ...previous, ...draftFilters, priceRange })); handleClick(); }} className="min-h-11 rounded-xl bg-primaryDark px-6 text-sm font-semibold text-white hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaryDark">Ver resultados</button>
        </footer>
      </section>
    </div>
  );
}
