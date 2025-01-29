"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { reviews } from "../db/db";
import Image from "next/image";

export const ReviewsCarousel = () => {
  return (
    <div className="reviews-section max-w-4xl bg-stone-200 mx-auto px-4 py-8">
      <Swiper
        modules={[Pagination, Autoplay]}
        // pagination={{ clickable: true }}
        autoplay={{ delay: 4500 }}
        loop={true}
        className="mySwiper"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id}>
            <div className="bg-opacity-0 rounded-lg p-6 text-center">
              <Image
                src={review.image}
                alt={review.name}
                width={70}
                height={70}
                className="avatar w-16 h-16 rounded-full mx-auto mb-4 border-2 border-gray-200"
              />
              <h3 className="text-lg font-semibold">{review.name}</h3>
              <div className="flex justify-center mt-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={i < review.rating ? "text-yellow-500" : "text-gray-300"}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="mt-2 text-gray-600">{review.review}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ReviewsCarousel;
