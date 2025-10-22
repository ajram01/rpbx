"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function CarouselBusiness() {
  const slides = [1, 2, 3 ];

  return (
    <Swiper
      modules={[ Pagination, Autoplay]}
      spaceBetween={25}
      slidesPerView={1}
      pagination={{ clickable: true, dynamicBullets: true, }}
      autoplay={{ delay: 5000 }}
      loop={false}
      className="w-full h-[250px] lg:h-[370px]"
    >
      {slides.map((slide, i) => (
        <SwiperSlide key={i}>
          <div className="bg-[url(/images/other/step1-RPBX.png)] bg-cover bg-center rounded-lg h-full">
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
