import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Car } from "./CarGrid";

export default function CarCard({ car }: { car: Car }) {
  const minPrice = Math.min(car.cashPrice, car.transferPrice);
  const maxPrice = Math.max(car.cashPrice, car.transferPrice);

  return (
    <Link
      href={`/product/${car.slug}`}
      className="group block"
    >
      <article className="rounded-2xl bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* Image */}
        <div className="relative h-[190px] overflow-hidden rounded-2xl bg-[#f3f3f3]">
          <Image
            src={car.image}
            alt={car.name}
            fill
            className="object-contain p-3 transition duration-500 group-hover:scale-105"
          />
        </div>

        {/* Information */}
        <div className="pt-5 text-center">

          {/* Car name */}
          <h3 className="text-xl font-black text-[#17171f]">
            {car.name}
          </h3>

          {/* Product code */}
          <p className="mt-2 text-sm text-red-400">
            شناسه محصول: {car.code}
          </p>

          {/* Decorative lines */}
          <div className="mt-5 flex justify-center gap-2">
            <span className="h-2 w-20 rounded-full bg-gray-100" />
            <span className="h-2 w-20 rounded-full bg-gray-100" />
            <span className="h-2 w-20 rounded-full bg-gray-100" />
          </div>

          {/* Buy button */}
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            className="
              mt-5 inline-flex items-center justify-center gap-2
              rounded-lg bg-red-600
              px-5 py-2
              text-sm font-bold text-white
              transition-all duration-300
              group-hover:bg-[#17171f]
              group-hover:text-white
            "
          >
            <ShoppingCart
              size={16}
              strokeWidth={2.5}
            />

            <span>خرید</span>
          </button>

          {/* Price */}
          <div className="mt-4 flex items-center justify-center gap-5 text-right">
            <span className="text-xs font-black tracking-[-0.04em] text-[#17171f]">
              {minPrice.toLocaleString("fa-IR")}
              {" – "}
              {maxPrice.toLocaleString("fa-IR")}
            </span>

            <span className="text-base font-bold text-gray-500">
              تومان
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}