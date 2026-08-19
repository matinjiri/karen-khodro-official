"use client";

import { useState } from "react";
import Image from "next/image";
import { Car } from "../cars/CarGrid";

export default function ProductGallery({
  car,
}: {
  car: Car;
}) {
  const images = car.gallery?.length
    ? car.gallery
    : [car.image];

  const [activeImage, setActiveImage] = useState(
    images[0]
  );

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">

      {/* Main image */}

      <div className="relative h-[440px] overflow-hidden rounded-xl bg-[#f5f5f5]">
        <Image
          src={activeImage}
          alt={car.name}
          fill
          priority
          className="object-contain"
        />
      </div>

      {/* Thumbnails */}

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {images.slice(0, 3).map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`relative h-[110px] overflow-hidden rounded-xl bg-[#f5f5f5] ${
                activeImage === image
                  ? "ring-2 ring-red-600"
                  : ""
              }`}
            >
              <Image
                src={image}
                alt={car.name}
                fill
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}

      {/* Installment */}

      <div className="mt-4 rounded-xl bg-[#f5f5f5] p-5">
        <h3 className="text-right text-lg font-black text-red-600">
          شرایط اقساط
        </h3>

        <p className="mt-4 text-right text-sm leading-7 text-gray-700">
          برای خرید اقساطی می‌توانید پس از ثبت درخواست
          در سایت برای خرید و پس از مشاوره با ما تماس
          بگیرید.
        </p>

        <div className="mt-5 flex justify-between text-sm font-bold">
          <span className="text-red-600">
            ۳۶ ماهه
          </span>

          <span className="text-red-600">
            ۶۰ ماهه
          </span>
        </div>

        <button className="mt-5 h-11 w-full rounded-lg bg-red-600 text-sm font-bold text-white">
          شرایط اقساط
        </button>
      </div>
    </div>
  );
}