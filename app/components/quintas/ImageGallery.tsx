"use client";

import LightGallery from "lightgallery/react";

// Plugins
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgFullscreen from "lightgallery/plugins/fullscreen";

// Styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-fullscreen.css";

type Props = {
  mainImage: string;
  images: string[];
  title: string;
};

export default function ImageGallery({ mainImage, images, title }: Props) {
  const allImages = [mainImage, ...images];

  return (
    <LightGallery
      speed={300}
      plugins={[lgThumbnail, lgZoom, lgFullscreen]}
      elementClassNames="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3"
      download={false}
    >
      {/* Main image — spans 2 cols + 2 rows on desktop */}
      <a
        href={mainImage}
        className="md:col-span-2 md:row-span-2 block overflow-hidden rounded-xl md:rounded-l-xl md:rounded-r-none cursor-pointer"
      >
        <img
          src={mainImage}
          alt={`${title} - Principal`}
          className="w-full h-[250px] md:h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </a>

      {/* Secondary images */}
      {images.slice(0, 4).map((image, index) => (
        <a
          key={image + index}
          href={image}
          className={`block overflow-hidden cursor-pointer ${
            index === 1
              ? "hidden md:block md:rounded-tr-xl"
              : index === 3
              ? "hidden md:block md:rounded-br-xl"
              : "hidden md:block"
          }`}
        >
          <img
            src={image}
            alt={`${title} - Vista ${index + 2}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </a>
      ))}

      {/* Mobile: show thumbnails row */}
      {images.slice(0, 3).map((image, index) => (
        <a
          key={`mobile-${image}-${index}`}
          href={image}
          className="block md:hidden overflow-hidden rounded-lg cursor-pointer"
        >
          <img
            src={image}
            alt={`${title} - Vista ${index + 2}`}
            className="w-full h-24 object-cover hover:scale-105 transition-transform duration-300"
          />
        </a>
      ))}

      {/* Remaining images (hidden, but accessible in the lightbox) */}
      {allImages.slice(5).map((image, index) => (
        <a
          key={`hidden-${image}-${index}`}
          href={image}
          className="hidden"
        >
          <img src={image} alt={`${title} - Vista ${index + 6}`} />
        </a>
      ))}
    </LightGallery>
  );
}
