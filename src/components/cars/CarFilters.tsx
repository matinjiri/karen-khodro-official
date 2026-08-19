"use client";

import PriceFilter from "./filters/PriceFilter";
import UsageFilter from "./filters/UsageFilter";
import PopularFilter from "./filters/PopularFilter";
import BrandFilter from "./filters/BrandFilter";
import BodyTypeFilter from "./filters/BodyTypeFilter";

type FilterOption = {
  id: number;
  filterId: number;
  value: string;
  label: string;
  isActive: boolean;
  sortOrder: number;
};

type CarFiltersProps = {
  minPrice: number;
  maxPrice: number;

  onPriceChange: (
    min: number,
    max: number
  ) => void;

  usage: string;

  onUsageChange: (
    value: string
  ) => void;
    usageOptions: FilterOption[];


  popular: string;

  onPopularChange: (
    value: string
  ) => void;

  popularOptions: FilterOption[];

  brand: string;

  onBrandChange: (
    value: string
  ) => void;

  brandOptions: FilterOption[];

  bodyType: string;

  onBodyTypeChange: (
    value: string
  ) => void;

  bodyTypeOptions: FilterOption[];

  onClearFilters: () => void;
};

export default function CarFilters({
  minPrice,
  maxPrice,
  onPriceChange,

  usage,
  onUsageChange,
  usageOptions,

  popular,
  onPopularChange,
  popularOptions,

  brand,
  onBrandChange,
  brandOptions,

  bodyType,
  onBodyTypeChange,
  bodyTypeOptions,

  onClearFilters,
}: CarFiltersProps) {
  return (
    <aside className="w-full xl:w-[260px]">
      <div className="sticky top-5">

        {/* Title */}

        <div className="mb-8 text-right">
          <h2 className="text-3xl font-black">
            فیلترها
          </h2>

          <p className="mt-2 text-sm tracking-[8px] text-red-600">
            FILTERS
          </p>
        </div>

        <div className="space-y-10">

          {/* Price */}

          <PriceFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={
              onPriceChange
            }
          />

          {/* Usage */}

          <UsageFilter
            value={usage}
            onChange={
              onUsageChange
            }
            options={usageOptions}
          />

          {/* Popular */}

<PopularFilter
  value={popular}
  onChange={onPopularChange}
  options={popularOptions}

          />

          {/* Brand */}

          <BrandFilter
            value={brand}
            onChange={
              onBrandChange
            }
            options={
              brandOptions
            }
          />

          {/* Body Type */}

          <BodyTypeFilter
            value={bodyType}
            onChange={
              onBodyTypeChange
            }
            options={
              bodyTypeOptions
            }
          />

          {/* Clear */}

          <button
            type="button"
            onClick={
              onClearFilters
            }
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-3
              text-sm
              font-bold
              text-gray-600
              transition
              hover:bg-red-600
              hover:text-white
            "
          >
            حذف همه فیلترها
          </button>

        </div>
      </div>
    </aside>
  );
}