"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import Image from "next/image";

// Lista de imágenes para la galería
const tablaoImages = [
  { id: 1, src: "/images/tablao1.jpg", alt: "Tablao Flamenco - Escenario" },
  { id: 2, src: "/images/tablao2.jpg", alt: "Artistas bailando" },
  { id: 3, src: "/images/tablao3.jpg", alt: "Guitarrista tocando" },
  { id: 4, src: "/images/tablao4.jpg", alt: "Vista del público" },
];

export const PhotoGallery = () => {
  return (
    <div className="photo-gallery max-w-4xl bg-neutral-900 mx-auto px-4 py-8">
      <h2 className="text-center text-yellow-700 text-3xl font-bold mb-6">Galería de Fotos</h2>
      <Swiper
        modules={[ Autoplay]}
        autoplay={{ delay: 4000 }}
        loop={true}
        pagination={{ clickable: false }}
        className="mySwiper"
      >
        {tablaoImages.map((image) => (
          <SwiperSlide key={image.id}>
            <div className="flex justify-center">
              <Image
                src={image.src}
                alt={image.alt}
                width={800}
                height={500}
                className="rounded-lg shadow-md"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PhotoGallery;
