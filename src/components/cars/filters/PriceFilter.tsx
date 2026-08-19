"use client";

import { useEffect, useState } from "react";

type PriceFilterProps = {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
};

export default function PriceFilter({
  minPrice,
  maxPrice,
  onPriceChange,
}: PriceFilterProps) {
  const MIN = 500_000;
  const MAX = 5_100_000_000;

  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  // --------------------------------
  // Sync with parent
  // --------------------------------

  useEffect(() => {
    setLocalMin(minPrice);
  }, [minPrice]);

  useEffect(() => {
    setLocalMax(maxPrice);
  }, [maxPrice]);

  // --------------------------------
  // Debounce
  // --------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        localMin !== minPrice ||
        localMax !== maxPrice
      ) {
        onPriceChange(localMin, localMax);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [
    localMin,
    localMax,
    minPrice,
    maxPrice,
    onPriceChange,
  ]);

  // --------------------------------
  // Percentages
  // --------------------------------

  const minPercent =
    ((localMin - MIN) / (MAX - MIN)) * 100;

  const maxPercent =
    ((localMax - MIN) / (MAX - MIN)) * 100;

  // --------------------------------
  // MIN
  // RIGHT THUMB
  // --------------------------------

  const handleMinChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);

    if (value >= localMax) {
      return;
    }

    setLocalMin(value);
  };

  // --------------------------------
  // MAX
  // LEFT THUMB
  // --------------------------------

  const handleMaxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);

    if (value <= localMin) {
      return;
    }

    setLocalMax(value);
  };

  return (
    <div>

      <h3 className="mb-8 text-lg font-bold">
        فیلتر براساس قیمت
      </h3>

      {/* ============================= */}
      {/* SLIDER */}
      {/* ============================= */}

      <div className="relative h-6">

        {/* Background */}

        <div
          className="
            absolute
            left-0
            right-0
            top-1/2
            h-1
            -translate-y-1/2
            rounded-full
            bg-gray-200
          "
        />

        {/* Active range */}

        <div
          className="
            absolute
            top-1/2
            h-1
            -translate-y-1/2
            rounded-full
            bg-red-600
          "
          style={{
            left: `${100 - maxPercent}%`,
            right: `${minPercent}%`,
          }}
        />

        {/* ================================= */}
        {/* MAX SLIDER */}
        {/* LEFT THUMB = MAX */}
        {/* ================================= */}

        <input
          type="range"
          min={MIN}
          max={MAX}
          value={localMax}
          onChange={handleMaxChange}
          dir="rtl"
          className="
            price-slider
            absolute
            inset-0
            z-20
            w-full
            appearance-none
            bg-transparent
          "
        />

        {/* ================================= */}
        {/* MIN SLIDER */}
        {/* RIGHT THUMB = MIN */}
        {/* ================================= */}

        <input
          type="range"
          min={MIN}
          max={MAX}
          value={localMin}
          onChange={handleMinChange}
          dir="rtl"
          className="
            price-slider
            absolute
            inset-0
            z-10
            w-full
            appearance-none
            bg-transparent
          "
        />
      </div>

      {/* ============================= */}
      {/* VALUES */}
      {/* ============================= */}

      <div
        className="
          mt-7
          flex
          items-center
          justify-between
          gap-4
          text-sm
          font-bold
        "
        dir="rtl"
      >

        {/* RIGHT = MIN */}

        <div className="text-right">
          <span className="text-gray-500">
            از
          </span>

          <div className="mt-1">
            {localMin.toLocaleString("fa-IR")}

            <span className="mr-1 text-xs text-gray-500">
              تومان
            </span>
          </div>
        </div>

        {/* LEFT = MAX */}

        <div className="text-left">
          <span className="text-gray-500">
            تا
          </span>

          <div className="mt-1">
            {localMax.toLocaleString("fa-IR")}

            <span className="mr-1 text-xs text-gray-500">
              تومان
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}