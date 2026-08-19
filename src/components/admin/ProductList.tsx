"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Product = {
  id: number;
  slug: string;
  name: string;
  code: string;
  image: string;

  cashPrice: string;
  transferPrice: string;

  manufacturer: string | null;
  productionYear: string | null;

  isPopular: boolean;
  isNew: boolean;
};

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const LIMIT = 10;

export default function ProductList() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [meta, setMeta] =
    useState<PaginationMeta | null>(null);

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isExporting, setIsExporting] =
    useState(false);

  const [isImporting, setIsImporting] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  // ==========================================
  // Fetch Products
  // ==========================================

  const fetchProducts = async () => {
    setIsLoading(true);

    try {
      const params =
        new URLSearchParams();

      params.set(
        "page",
        String(page)
      );

      params.set(
        "limit",
        String(LIMIT)
      );

      if (search) {
        params.set(
          "search",
          search
        );
      }

      const response =
        await fetch(
          `/api/product?${params.toString()}`,
          {
            cache: "no-store",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch products"
        );
      }

      const result =
        await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
          "Failed to fetch products"
        );
      }

      setProducts(
        result.data ?? []
      );

      setMeta(
        result.meta ?? null
      );
    } catch (error) {
      console.error(
        "Failed to fetch products:",
        error
      );

      setProducts([]);
      setMeta(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // Effects
  // ==========================================

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  // ==========================================
  // Search
  // ==========================================

  const handleSearch = () => {
    setPage(1);

    setSearch(
      searchInput.trim()
    );
  };

  // ==========================================
  // Export Excel
  // ==========================================

  const handleExport = async () => {
    if (isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      const params =
        new URLSearchParams();

      // Export according to current search
      if (search) {
        params.set(
          "search",
          search
        );
      }

      const response =
        await fetch(
          `/api/admin/product/export?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to export products"
        );
      }

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "products.xlsx";

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        url
      );
    } catch (error) {
      console.error(
        "Failed to export products:",
        error
      );

      alert(
        "خروجی Excel با خطا مواجه شد."
      );
    } finally {
      setIsExporting(false);
    }
  };


  const handleImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setIsImporting(true);

      // ========================================
      // Validate File
      // ========================================

      const fileName =
        file.name.toLowerCase();

      if (
        !fileName.endsWith(".xlsx") &&
        !fileName.endsWith(".xls")
      ) {
        alert(
          "لطفاً یک فایل Excel معتبر انتخاب کنید."
        );

        return;
      }

      // ========================================
      // Form Data
      // ========================================

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      // ========================================
      // Upload
      // ========================================

      const response =
        await fetch(
          "/api/admin/product/import",
          {
            method: "POST",
            body: formData,
          }
        );

      const result =
        await response.json();

      // ========================================
      // Error
      // ========================================

      if (!response.ok || !result.success) {
        let message =
          result.message ||
          "خطایی در وارد کردن فایل رخ داد.";

        // Missing codes
        if (
          Array.isArray(
            result.missingCodes
          )
        ) {
          message +=
            "\n\nکدهای پیدا نشده:\n" +
            result.missingCodes.join(
              ", "
            );
        }

        // Validation errors
        if (
          Array.isArray(
            result.errors
          )
        ) {
          message +=
            "\n\n" +
            result.errors.join(
              "\n"
            );
        }

        alert(message);

        return;
      }

      // ========================================
      // Success
      // ========================================

      alert(
        `${result.updated} محصول با موفقیت بروزرسانی شد.`
      );

      // Refresh list
      await fetchProducts();
    } catch (error) {
      console.error(
        "Import Excel error:",
        error
      );

      alert(
        "خطایی در ارتباط با سرور رخ داد."
      );
    } finally {
      setIsImporting(false);

      // Allow selecting same file again
      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }
    }
  };


  return (
    <div className="space-y-6">

      {/* =====================================
          Header
      ====================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="mb-2 text-sm text-gray-400">
            پنل مدیریت
          </p>

          <h1 className="text-3xl font-bold text-[#111]">
            محصولات
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            مدیریت خودروهای ثبت شده
          </p>
        </div>

        <div className="flex gap-3">

          <Link
            href="/admin"
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              px-5
              py-3
              text-sm
              font-bold
              text-gray-700
              transition
              hover:bg-gray-100
            "
          >
            داشبورد
          </Link>

          <Link
            href="/admin"
            className="
              rounded-xl
              bg-red-600
              px-5
              py-3
              text-sm
              font-bold
              text-white
              transition
              hover:bg-red-700
            "
          >
            + ایجاد محصول
          </Link>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="
              rounded-xl
              bg-red-600
              px-5
              py-3
              text-sm
              font-bold
              text-white
              transition
              hover:bg-green-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isExporting
              ? "در حال دریافت..."
              : "خروجی Excel"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImport}
            className="hidden"
          />

          <button
            type="button"
            disabled={isImporting}
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="
              rounded-xl
              bg-red-600
              px-5
              py-3
              text-sm
              font-bold
              text-white
              transition
              hover:bg-green-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isImporting
              ? "در حال بروزرسانی..."
              : "ورود از Excel"}
          </button>

        </div>
      </div>

      {/* =====================================
          Search
      ====================================== */}

      <div className="rounded-3xl bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-3 sm:flex-row">

          <input
            type="text"
            value={searchInput}
            onChange={(event) =>
              setSearchInput(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter"
              ) {
                handleSearch();
              }
            }}
            placeholder="جستجو بر اساس نام، کد، برند..."
            className="
              h-12
              flex-1
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              px-4
              text-sm
              outline-none
              transition
              focus:border-gray-400
            "
          />

          <button
            type="button"
            onClick={handleSearch}
            className="
              h-12
              rounded-xl
              bg-red-600
              px-8
              text-sm
              font-bold
              text-white
              transition
              hover:bg-red-700
            "
          >
            جستجو
          </button>

        </div>

      </div>

      {/* =====================================
          Count
      ====================================== */}

      {meta && (
        <div className="text-sm text-gray-400">
          تعداد محصولات:{" "}
          <span className="font-bold text-[#111]">
            {meta.total.toLocaleString(
              "fa-IR"
            )}
          </span>
        </div>
      )}

      {/* =====================================
          Table
      ====================================== */}

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px] text-right">

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">

                <th className="px-6 py-4 text-xs font-bold text-gray-500">
                  خودرو
                </th>

                <th className="px-6 py-4 text-xs font-bold text-gray-500">
                  کد
                </th>

                <th className="px-6 py-4 text-xs font-bold text-gray-500">
                  سازنده
                </th>

                <th className="px-6 py-4 text-xs font-bold text-gray-500">
                  قیمت نقدی
                </th>

                <th className="px-6 py-4 text-xs font-bold text-gray-500">
                  قیمت انتقال
                </th>

                <th className="px-6 py-4 text-xs font-bold text-gray-500">
                  وضعیت
                </th>

                <th className="px-6 py-4 text-xs font-bold text-gray-500">
                  عملیات
                </th>

              </tr>
            </thead>

            <tbody>

              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-16 text-center text-sm text-gray-400"
                  >
                    در حال دریافت محصولات...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-16 text-center text-sm text-gray-400"
                  >
                    محصولی پیدا نشد.
                  </td>
                </tr>
              ) : (
                products.map(
                  (product) => (
                    <tr
                      key={product.id}
                      className="
                        border-b
                        border-gray-100
                        last:border-0
                        hover:bg-gray-50
                      "
                    >

                      {/* Product */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-4">

                          <img
                            src={product.image}
                            alt={product.name}
                            className="
                              h-16
                              w-20
                              rounded-xl
                              bg-gray-100
                              object-cover
                            "
                          />

                          <div>

                            <p className="font-bold text-[#111]">
                              {product.name}
                            </p>

                            {product.productionYear && (
                              <p className="mt-1 text-xs text-gray-400">
                                مدل{" "}
                                {product.productionYear}
                              </p>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* Code */}

                      <td className="px-6 py-4">

                        <span className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-bold text-gray-600">
                          {product.code}
                        </span>

                      </td>

                      {/* Manufacturer */}

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.manufacturer ||
                          "—"}
                      </td>

                      {/* Cash */}

                      <td className="px-6 py-4">

                        <p className="text-sm font-bold text-[#111]">
                          {formatPrice(
                            product.cashPrice
                          )}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          تومان
                        </p>

                      </td>

                      {/* Transfer */}

                      <td className="px-6 py-4">

                        <p className="text-sm font-bold text-[#111]">
                          {formatPrice(
                            product.transferPrice
                          )}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          تومان
                        </p>

                      </td>

                      {/* Status */}

                      <td className="px-6 py-4">

                        <div className="flex flex-wrap gap-2">

                          {product.isNew && (
                            <span className="rounded-lg bg-green-50 px-2 py-1 text-xs font-bold text-green-600">
                              جدید
                            </span>
                          )}

                          {product.isPopular && (
                            <span className="rounded-lg bg-red-50 px-2 py-1 text-xs font-bold text-red-600">
                              محبوب
                            </span>
                          )}

                          {!product.isNew &&
                            !product.isPopular && (
                              <span className="text-xs text-gray-400">
                                —
                              </span>
                            )}

                        </div>

                      </td>

                      {/* Actions */}

                      <td className="px-6 py-4">

                        <Link
                          href={`/admin/products/${product.id}`}
                          className="
                            inline-flex
                            rounded-xl
                            bg-gray-100
                            px-4
                            py-2
                            text-xs
                            font-bold
                            text-gray-700
                            transition
                            hover:bg-[#111]
                            hover:text-white
                          "
                        >
                          ویرایش
                        </Link>

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =====================================
          Pagination
      ====================================== */}

      {meta &&
        meta.totalPages > 1 && (
          <div className="flex justify-center">

            <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-sm">

              <button
                type="button"
                disabled={
                  !meta.hasPreviousPage ||
                  isLoading
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      current - 1
                  )
                }
                className="
                  rounded-xl
                  px-4
                  py-2
                  text-sm
                  font-bold
                  disabled:cursor-not-allowed
                  disabled:text-gray-300
                  hover:bg-gray-100
                "
              >
                قبلی
              </button>

              {Array.from(
                {
                  length:
                    meta.totalPages,
                },
                (_, index) =>
                  index + 1
              ).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    disabled={isLoading}
                    onClick={() =>
                      setPage(
                        pageNumber
                      )
                    }
                    className={`
                      h-10
                      w-10
                      rounded-xl
                      text-sm
                      font-bold
                      transition
                      ${page ===
                        pageNumber
                        ? "bg-red-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                      }
                    `}
                  >
                    {pageNumber.toLocaleString(
                      "fa-IR"
                    )}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={
                  !meta.hasNextPage ||
                  isLoading
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      current + 1
                  )
                }
                className="
                  rounded-xl
                  px-4
                  py-2
                  text-sm
                  font-bold
                  disabled:cursor-not-allowed
                  disabled:text-gray-300
                  hover:bg-gray-100
                "
              >
                بعدی
              </button>

            </div>

          </div>
        )}

    </div>
  );
}

// ==========================================
// Format Price
// ==========================================

function formatPrice(
  value: string
) {
  try {
    return BigInt(value).toLocaleString(
      "fa-IR"
    );
  } catch {
    return "—";
  }
}