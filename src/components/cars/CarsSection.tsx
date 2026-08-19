"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import CarGrid, { Car } from "./CarGrid";
import CarFilters from "./CarFilters";

const MIN_PRICE = 500_000;
const MAX_PRICE = 5_100_000_000;

const LIMIT = 6;

type FilterOption = {
  id: number;
  filterId: number;
  value: string;
  label: string;
  isActive: boolean;
  sortOrder: number;
};

type Filter = {
  id: number;
  key: string;
  title: string;
  type:
  | "SELECT"
  | "MULTI_SELECT"
  | "RANGE"
  | "BOOLEAN";
  isActive: boolean;
  sortOrder: number;
  options: FilterOption[];
};

export default function CarsSection() {
  // -------------------------
  // Data
  // -------------------------

  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] =
    useState(false);

  // -------------------------
  // Filters from DB
  // -------------------------

  const [filters, setFilters] =
    useState<Filter[]>([]);

  const [isFiltersLoading, setIsFiltersLoading] =
    useState(true);

  // -------------------------
  // Search
  // -------------------------

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  // -------------------------
  // Filters
  // -------------------------

  const [minPrice, setMinPrice] =
    useState(MIN_PRICE);

  const [maxPrice, setMaxPrice] =
    useState(MAX_PRICE);

  const [usage, setUsage] =
    useState("");

  const [popular, setPopular] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [bodyType, setBodyType] =
    useState("");

  // -------------------------
  // Sort
  // -------------------------

  const [sort, setSort] =
    useState("");

  // -------------------------
  // Pagination
  // -------------------------

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  // -------------------------
  // Fetch Filters
  // -------------------------

  useEffect(() => {
    async function fetchFilters() {
      try {
        const response = await fetch(
          "/api/product/filters",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch filters"
          );
        }

        const result =
          await response.json();

        if (!result.success) {
          throw new Error(
            result.message ||
            "Failed to fetch filters"
          );
        }

        setFilters(
          result.data ?? []
        );
      } catch (error) {
        console.error(
          "Failed to fetch filters:",
          error
        );

        setFilters([]);
      } finally {
        setIsFiltersLoading(false);
      }
    }

    fetchFilters();
  }, []);

  // -------------------------
  // Get Brand Filter
  // -------------------------

  const brandFilter =
    filters.find(
      (filter) =>
        filter.key === "brand"
    );

  // -------------------------
  // Get Body Type Filter
  // -------------------------

  const bodyTypeFilter =
    filters.find(
      (filter) =>
        filter.key === "bodyType"
    );

  const popularFilter =
    filters.find(
      (filter) =>
        filter.key === "popular"
    );

  const usageFilter =
    filters.find(
      (filter) =>
        filter.key === "usage"
    );

  // -------------------------
  // Fetch Cars
  // -------------------------

  const fetchCars = async () => {
    setIsLoading(true);

    try {
      const params =
        new URLSearchParams();

      // -------------------------
      // Search
      // -------------------------

      if (search) {
        params.set(
          "search",
          search
        );
      }

      // -------------------------
      // Price
      // -------------------------

      if (
        minPrice >
        MIN_PRICE
      ) {
        params.set(
          "minPrice",
          String(minPrice)
        );
      }

      if (
        maxPrice <
        MAX_PRICE
      ) {
        params.set(
          "maxPrice",
          String(maxPrice)
        );
      }

      // -------------------------
      // Filters
      // -------------------------

      if (usage) {
        params.set(
          "usage",
          usage
        );
      }

      if (popular) {
        params.set(
          "popular",
          popular
        );
      }

      if (brand) {
        params.set(
          "brand",
          brand
        );
      }

      if (bodyType) {
        params.set(
          "bodyType",
          bodyType
        );
      }

      // -------------------------
      // Sort
      // -------------------------

      if (sort) {
        params.set(
          "sort",
          sort
        );
      }

      // -------------------------
      // Pagination
      // -------------------------

      params.set(
        "page",
        String(page)
      );

      params.set(
        "limit",
        String(LIMIT)
      );

      // -------------------------
      // Request
      // -------------------------

      const response =
        await fetch(
          `/api/product?${params.toString()}`
        );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch cars"
        );
      }

      const result =
        await response.json();

      setCars(
        result.data ?? []
      );

      setTotalPages(
        result.meta?.totalPages ??
        1
      );
    } catch (error) {
      console.error(
        "Failed to fetch cars:",
        error
      );

      setCars([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------
  // Fetch when filters change
  // -------------------------

  useEffect(() => {
    fetchCars();
  }, [
    search,
    minPrice,
    maxPrice,
    usage,
    popular,
    brand,
    bodyType,
    sort,
    page,
  ]);

  // -------------------------
  // Price
  // -------------------------

  const handlePriceChange = (
    min: number,
    max: number
  ) => {
    setMinPrice(min);
    setMaxPrice(max);

    setPage(1);
  };

  // -------------------------
  // Clear filters
  // -------------------------

  const handleClearFilters = () => {
    setMinPrice(
      MIN_PRICE
    );

    setMaxPrice(
      MAX_PRICE
    );

    setUsage("");

    setPopular("");

    setBrand("");

    setBodyType("");

    setSearch("");

    setSearchInput("");

    setSort("");

    setPage(1);
  };

  // -------------------------
  // Search
  // -------------------------

  const handleSearch = () => {
    setPage(1);

    setSearch(
      searchInput.trim()
    );
  };

  // -------------------------
  // Render
  // -------------------------

  return (
    <section className="container-custom bg-[#f5f5f5] px-6 pb-24">
      <div className="mx-auto max-w-[1500px]">

        <div className="flex flex-col gap-10 xl:flex-row">

          {/* =========================
              Filters
          ========================= */}

          <CarFilters
            minPrice={
              minPrice
            }

            maxPrice={
              maxPrice
            }

            onPriceChange={
              handlePriceChange
            }

            usage={usage}
            onUsageChange={(value) => {
              setUsage(value);
              setPage(1);
            }}
            usageOptions={
              usageFilter?.options ?? []
            }

            popular={popular}
            popularOptions={popularFilter?.options ?? []}

            onPopularChange={(
              value
            ) => {
              setPopular(value);
              setPage(1);
            }}

            brand={
              brand
            }

            onBrandChange={(
              value
            ) => {
              setBrand(value);
              setPage(1);
            }}

            brandOptions={
              brandFilter?.options ??
              []
            }

            bodyType={
              bodyType
            }

            onBodyTypeChange={(
              value
            ) => {
              setBodyType(value);
              setPage(1);
            }}

            bodyTypeOptions={
              bodyTypeFilter?.options ??
              []
            }

            onClearFilters={
              handleClearFilters
            }
          />

          {/* =========================
              Main Content
          ========================= */}

          <div className="min-w-0 flex-1">

            {/* Header */}

            <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div className="text-right">
                <h2 className="text-3xl font-black">
                  همه خودروها
                </h2>

                <p className="mt-2 text-sm tracking-[8px] text-red-600">
                  ALL CARS
                </p>
              </div>

              {/* Search */}

              <div className="flex flex-col gap-3 sm:flex-row-reverse">

                <div className="flex h-12 overflow-hidden rounded-xl bg-white">

                  <input
                    type="text"
                    value={
                      searchInput
                    }
                    onChange={(
                      event
                    ) =>
                      setSearchInput(
                        event.target.value
                      )
                    }
                    onKeyDown={(
                      event
                    ) => {
                      if (
                        event.key ===
                        "Enter"
                      ) {
                        handleSearch();
                      }
                    }}
                    placeholder="جستجو ..."
                    className="w-[220px] border-none bg-transparent px-5 text-sm outline-none"
                  />

                  <button
                    type="button"
                    onClick={
                      handleSearch
                    }
                    className="flex w-14 items-center justify-center bg-red-600 text-white transition hover:bg-red-700"
                  >
                    <Search
                      size={20}
                    />
                  </button>

                </div>

              </div>

            </div>

            {/* Cars */}

            <div className="relative">

              <CarGrid
                cars={cars}
              />

              {isLoading && (
                <div className="absolute inset-0 z-10 rounded-2xl bg-white/60 backdrop-blur-[1px]" />
              )}

            </div>

            {/* Pagination */}

            {totalPages > 1 && (
              <div className="mt-14 flex justify-center">

                <div className="flex items-center gap-4">

                  {/* Previous */}

                  <button
                    type="button"
                    disabled={
                      page === 1 ||
                      isLoading
                    }
                    onClick={() =>
                      setPage(
                        (
                          current
                        ) =>
                          current - 1
                      )
                    }
                    className="text-sm disabled:cursor-not-allowed disabled:text-gray-300"
                  >
                    قبلی
                  </button>

                  {/* Pages */}

                  {Array.from(
                    {
                      length:
                        totalPages,
                    },
                    (
                      _,
                      index
                    ) =>
                      index + 1
                  ).map(
                    (
                      pageNumber
                    ) => (
                      <button
                        type="button"
                        key={
                          pageNumber
                        }
                        disabled={
                          isLoading
                        }
                        onClick={() =>
                          setPage(
                            pageNumber
                          )
                        }
                        className={
                          page ===
                            pageNumber
                            ? "h-12 w-12 rounded-lg bg-red-600 text-white"
                            : "h-12 w-12 rounded-lg hover:bg-gray-100"
                        }
                      >
                        {pageNumber.toLocaleString(
                          "fa-IR"
                        )}
                      </button>
                    )
                  )}

                  {/* Next */}

                  <button
                    type="button"
                    disabled={
                      page ===
                      totalPages ||
                      isLoading
                    }
                    onClick={() =>
                      setPage(
                        (
                          current
                        ) =>
                          current + 1
                      )
                    }
                    className="text-sm disabled:cursor-not-allowed disabled:text-gray-300"
                  >
                    بعدی
                  </button>

                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}