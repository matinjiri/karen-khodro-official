"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

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

type GalleryItem = {
  url: string;
  sortOrder: number;
};

type TechnicalCheckItem = {
  text: string;
  type: "strength" | "weakness";
};

type TechnicalDataItem = {
  label: string;
  value: string;
  type: "specification" | "performance";
};

export default function ProductForm() {
  const [loading, setLoading] = useState(false);
  const [filtersLoading, setFiltersLoading] = useState(true);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // Filters
  // ==========================================

  const [filters, setFilters] = useState<Filter[]>([]);

  const [selectedFilters, setSelectedFilters] =
    useState<Record<string, number | boolean>>({});

  // ==========================================
  // Product Form
  // ==========================================

  const [form, setForm] = useState({
    slug: "",
    name: "",
    code: "",
    image: "",

    description: "",
    fullDescription: "",

    cashPrice: "",
    transferPrice: "",

    manufacturer: "",
    productionYear: "",

    isPopular: false,
    isNew: false,

    technicalCheck: {
      purchaseValue: 0,
      quality: 0,
      performance: 0,
      fuelConsumption: 0,
    },
  });

  // ==========================================
  // Gallery
  // ==========================================

  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  // ==========================================
  // Technical Check
  // ==========================================

  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);

  // ==========================================
  // Technical Data
  // ==========================================

  const [
    technicalSpecifications,
    setTechnicalSpecifications,
  ] = useState<TechnicalDataItem[]>([]);

  const [
    technicalPerformance,
    setTechnicalPerformance,
  ] = useState<TechnicalDataItem[]>([]);

  // ==========================================
  // Load Filters
  // ==========================================

  useEffect(() => {
    const loadFilters = async () => {
      try {
        setFiltersLoading(true);
        setError("");

        const response = await fetch(
          "/api/product/filters"
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "دریافت فیلترها ناموفق بود."
          );
        }

        setFilters(data.data);
      } catch (error) {
        console.error(
          "Load filters error:",
          error
        );

        setError(
          "دریافت فیلترهای محصول ناموفق بود."
        );
      } finally {
        setFiltersLoading(false);
      }
    };

    loadFilters();
  }, []);

  // ==========================================
  // Generic Field
  // ==========================================

  const updateField = (
    field: keyof typeof form,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==========================================
  // Filter
  // ==========================================

  const updateFilter = (
    filterKey: string,
    value: number | boolean
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  // ==========================================
  // Technical Check
  // ==========================================

  const updateTechnicalCheck = (
    field: keyof typeof form.technicalCheck,
    value: number
  ) => {
    setForm((prev) => ({
      ...prev,
      technicalCheck: {
        ...prev.technicalCheck,
        [field]: value,
      },
    }));
  };

  // ==========================================
  // Gallery
  // ==========================================

  const addGalleryImage = () => {
    setGallery((prev) => [
      ...prev,
      {
        url: "",
        sortOrder: prev.length,
      },
    ]);
  };

  const updateGalleryImage = (
    index: number,
    url: string
  ) => {
    setGallery((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              url,
            }
          : item
      )
    );
  };

  const removeGalleryImage = (
    index: number
  ) => {
    setGallery((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((item, i) => ({
          ...item,
          sortOrder: i,
        }))
    );
  };

  // ==========================================
  // Strengths
  // ==========================================

  const addStrength = () => {
    setStrengths((prev) => [...prev, ""]);
  };

  const updateStrength = (
    index: number,
    value: string
  ) => {
    setStrengths((prev) =>
      prev.map((item, i) =>
        i === index ? value : item
      )
    );
  };

  const removeStrength = (
    index: number
  ) => {
    setStrengths((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ==========================================
  // Weaknesses
  // ==========================================

  const addWeakness = () => {
    setWeaknesses((prev) => [...prev, ""]);
  };

  const updateWeakness = (
    index: number,
    value: string
  ) => {
    setWeaknesses((prev) =>
      prev.map((item, i) =>
        i === index ? value : item
      )
    );
  };

  const removeWeakness = (
    index: number
  ) => {
    setWeaknesses((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ==========================================
  // Technical Specification
  // ==========================================

  const addTechnicalSpecification = () => {
    setTechnicalSpecifications((prev) => [
      ...prev,
      {
        label: "",
        value: "",
        type: "specification",
      },
    ]);
  };

  const updateTechnicalSpecification = (
    index: number,
    field: "label" | "value",
    value: string
  ) => {
    setTechnicalSpecifications((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const removeTechnicalSpecification = (
    index: number
  ) => {
    setTechnicalSpecifications((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ==========================================
  // Technical Performance
  // ==========================================

  const addTechnicalPerformance = () => {
    setTechnicalPerformance((prev) => [
      ...prev,
      {
        label: "",
        value: "",
        type: "performance",
      },
    ]);
  };

  const updateTechnicalPerformance = (
    index: number,
    field: "label" | "value",
    value: string
  ) => {
    setTechnicalPerformance((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const removeTechnicalPerformance = (
    index: number
  ) => {
    setTechnicalPerformance((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ==========================================
  // Submit
  // ==========================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // ========================================
      // Basic Validation
      // ========================================

      if (!form.name.trim()) {
        setError("نام خودرو الزامی است.");
        return;
      }

      if (!form.slug.trim()) {
        setError("Slug الزامی است.");
        return;
      }

      if (!form.code.trim()) {
        setError("کد خودرو الزامی است.");
        return;
      }

      if (!form.image.trim()) {
        setError("تصویر اصلی الزامی است.");
        return;
      }

      if (!form.cashPrice) {
        setError("قیمت نقدی الزامی است.");
        return;
      }

      if (!form.transferPrice) {
        setError("قیمت انتقال الزامی است.");
        return;
      }

      // ========================================
      // Gallery
      // ========================================

      const cleanGallery = gallery
        .filter((item) => item.url.trim())
        .map((item, index) => ({
          url: item.url.trim(),
          sortOrder: index,
        }));

      // ========================================
      // Strengths
      // ========================================

      const cleanStrengths =
        strengths
          .filter((item) => item.trim())
          .map(
            (text): TechnicalCheckItem => ({
              text: text.trim(),
              type: "strength",
            })
          );

      // ========================================
      // Weaknesses
      // ========================================

      const cleanWeaknesses =
        weaknesses
          .filter((item) => item.trim())
          .map(
            (text): TechnicalCheckItem => ({
              text: text.trim(),
              type: "weakness",
            })
          );

      // ========================================
      // Technical Data
      // ========================================

      const cleanSpecifications =
        technicalSpecifications.filter(
          (item) =>
            item.label.trim() &&
            item.value.trim()
        );

      const cleanPerformance =
        technicalPerformance.filter(
          (item) =>
            item.label.trim() &&
            item.value.trim()
        );

      // ========================================
      // Technical Check
      // ========================================

      const hasTechnicalCheck =
        form.technicalCheck.purchaseValue > 0 ||
        form.technicalCheck.quality > 0 ||
        form.technicalCheck.performance > 0 ||
        form.technicalCheck.fuelConsumption > 0 ||
        cleanStrengths.length > 0 ||
        cleanWeaknesses.length > 0;

      // ========================================
      // Technical Data
      // ========================================

      const hasTechnicalData =
        cleanSpecifications.length > 0 ||
        cleanPerformance.length > 0;

      // ========================================
      // Selected Filter Option IDs
      // ========================================

      const selectedFilterIds =
        Object.values(selectedFilters)
          .filter(
            (value): value is number =>
              typeof value === "number" &&
              Number.isInteger(value) &&
              value > 0
          );

      // ========================================
      // Request
      // ========================================

      const response = await fetch(
        "/api/product",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            // Product
            slug: form.slug.trim(),
            name: form.name.trim(),
            code: form.code.trim(),

            image: form.image.trim(),

            description:
              form.description.trim() || null,

            fullDescription:
              form.fullDescription.trim() || null,

            cashPrice: Number(
              form.cashPrice
            ),

            transferPrice: Number(
              form.transferPrice
            ),

            manufacturer:
              form.manufacturer.trim() || null,

            productionYear:
              form.productionYear.trim() || null,

            isPopular: form.isPopular,
            isNew: form.isNew,

            // ====================================
            // IMPORTANT
            // ====================================

            filterOptionIds:
              selectedFilterIds,

            // Gallery
            gallery: cleanGallery,

            // Technical Check
            technicalCheck:
              hasTechnicalCheck
                ? {
                    ...form.technicalCheck,

                    items: [
                      ...cleanStrengths,
                      ...cleanWeaknesses,
                    ],
                  }
                : null,

            // Technical Data
            technicalData:
              hasTechnicalData
                ? {
                    items: [
                      ...cleanSpecifications,
                      ...cleanPerformance,
                    ],
                  }
                : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "ایجاد محصول ناموفق بود."
        );

        return;
      }

      // ========================================
      // Success
      // ========================================

      setSuccess(
        "محصول با موفقیت ایجاد شد."
      );

      // ========================================
      // Reset
      // ========================================

      setForm({
        slug: "",
        name: "",
        code: "",
        image: "",

        description: "",
        fullDescription: "",

        cashPrice: "",
        transferPrice: "",

        manufacturer: "",
        productionYear: "",

        isPopular: false,
        isNew: false,

        technicalCheck: {
          purchaseValue: 0,
          quality: 0,
          performance: 0,
          fuelConsumption: 0,
        },
      });

      setSelectedFilters({});
      setGallery([]);
      setStrengths([]);
      setWeaknesses([]);
      setTechnicalSpecifications([]);
      setTechnicalPerformance([]);
    } catch (error) {
      console.error(
        "Create product error:",
        error
      );

      setError(
        "خطایی در ارتباط با سرور رخ داد."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
      dir="rtl"
    >
      {/* Messages */}

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Basic Information */}

      <AdminSection
        title="اطلاعات اصلی"
        description="اطلاعات پایه خودرو"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="نام خودرو"
            value={form.name}
            onChange={(value) =>
              updateField("name", value)
            }
            placeholder="تیگارد X35 پلاس"
            required
          />

          <Input
            label="کد خودرو"
            value={form.code}
            onChange={(value) =>
              updateField("code", value)
            }
            placeholder="5691"
            required
          />

          <Input
            label="Slug"
            value={form.slug}
            onChange={(value) =>
              updateField("slug", value)
            }
            placeholder="tigard-x35-plus"
            dir="ltr"
            required
          />

          <Input
            label="تصویر اصلی"
            value={form.image}
            onChange={(value) =>
              updateField("image", value)
            }
            placeholder="/images/cars/tigard-x35.jpg"
            dir="ltr"
            required
          />

          <Input
            label="سازنده"
            value={form.manufacturer}
            onChange={(value) =>
              updateField(
                "manufacturer",
                value
              )
            }
            placeholder="BAIC"
          />

          <Input
            label="سال تولید"
            value={form.productionYear}
            onChange={(value) =>
              updateField(
                "productionYear",
                value
              )
            }
            placeholder="1405"
          />
        </div>
      </AdminSection>

      {/* Filters */}

      {filtersLoading ? (
        <AdminSection
          title="فیلترها"
          description="در حال دریافت فیلترها"
        >
          <div className="py-5 text-sm text-gray-400">
            در حال دریافت فیلترها...
          </div>
        </AdminSection>
      ) : (
        <DynamicFilters
          filters={filters}
          selectedFilters={selectedFilters}
          onChange={updateFilter}
        />
      )}

      {/* Prices */}

      <AdminSection
        title="قیمت"
        description="قیمت‌های خودرو"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="قیمت نقدی"
            value={form.cashPrice}
            onChange={(value) =>
              updateField(
                "cashPrice",
                value
              )
            }
            placeholder="150000000"
            dir="ltr"
            type="number"
            required
          />

          <Input
            label="قیمت انتقال"
            value={form.transferPrice}
            onChange={(value) =>
              updateField(
                "transferPrice",
                value
              )
            }
            placeholder="100000000"
            dir="ltr"
            type="number"
            required
          />
        </div>
      </AdminSection>

      {/* Description */}

      <AdminSection
        title="توضیحات"
        description="توضیحات کوتاه و کامل خودرو"
      >
        <div className="space-y-5">
          <Textarea
            label="توضیحات کوتاه"
            value={form.description}
            onChange={(value) =>
              updateField(
                "description",
                value
              )
            }
            placeholder="توضیحات کوتاه..."
          />

          <Textarea
            label="توضیحات کامل"
            value={form.fullDescription}
            onChange={(value) =>
              updateField(
                "fullDescription",
                value
              )
            }
            placeholder="توضیحات کامل خودرو..."
            rows={7}
          />
        </div>
      </AdminSection>

      {/* Gallery */}

      <AdminSection
        title="گالری تصاویر"
        description="تصاویر اضافی خودرو"
      >
        <div className="space-y-4">
          {gallery.map(
            (item, index) => (
              <div
                key={index}
                className="flex gap-3"
              >
                <input
                  type="text"
                  value={item.url}
                  dir="ltr"
                  onChange={(e) =>
                    updateGalleryImage(
                      index,
                      e.target.value
                    )
                  }
                  placeholder="/images/cars/car-1.jpg"
                  className="h-[50px] flex-1 rounded-2xl border border-gray-200 bg-[#fafafa] px-4 text-sm outline-none focus:border-[#111]"
                />

                <button
                  type="button"
                  onClick={() =>
                    removeGalleryImage(
                      index
                    )
                  }
                  className="rounded-2xl px-4 text-sm text-red-500 hover:bg-red-50"
                >
                  حذف
                </button>
              </div>
            )
          )}

          <button
            type="button"
            onClick={addGalleryImage}
            className="rounded-2xl border border-dashed border-gray-300 px-5 py-3 text-sm text-gray-600 hover:bg-gray-50"
          >
            + افزودن تصویر
          </button>
        </div>
      </AdminSection>

      {/* Technical Check */}

      <AdminSection
        title="بررسی فنی"
        description="امتیاز و ارزیابی خودرو"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <NumberInput
            label="ارزش خرید"
            value={
              form.technicalCheck
                .purchaseValue
            }
            onChange={(value) =>
              updateTechnicalCheck(
                "purchaseValue",
                value
              )
            }
          />

          <NumberInput
            label="کیفیت"
            value={
              form.technicalCheck.quality
            }
            onChange={(value) =>
              updateTechnicalCheck(
                "quality",
                value
              )
            }
          />

          <NumberInput
            label="کارایی"
            value={
              form.technicalCheck
                .performance
            }
            onChange={(value) =>
              updateTechnicalCheck(
                "performance",
                value
              )
            }
          />

          <NumberInput
            label="مصرف سوخت"
            value={
              form.technicalCheck
                .fuelConsumption
            }
            onChange={(value) =>
              updateTechnicalCheck(
                "fuelConsumption",
                value
              )
            }
          />
        </div>

        {/* Strengths */}

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-semibold">
              نقاط قوت
            </h4>

            <button
              type="button"
              onClick={addStrength}
              className="text-sm text-green-600"
            >
              + افزودن
            </button>
          </div>

          <div className="space-y-3">
            {strengths.map(
              (item, index) => (
                <div
                  key={index}
                  className="flex gap-3"
                >
                  <input
                    value={item}
                    onChange={(e) =>
                      updateStrength(
                        index,
                        e.target.value
                      )
                    }
                    placeholder="مثلاً کیفیت ساخت مناسب"
                    className="h-[48px] flex-1 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#111]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeStrength(
                        index
                      )
                    }
                    className="text-sm text-red-500"
                  >
                    حذف
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        {/* Weaknesses */}

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-semibold">
              نقاط ضعف
            </h4>

            <button
              type="button"
              onClick={addWeakness}
              className="text-sm text-red-600"
            >
              + افزودن
            </button>
          </div>

          <div className="space-y-3">
            {weaknesses.map(
              (item, index) => (
                <div
                  key={index}
                  className="flex gap-3"
                >
                  <input
                    value={item}
                    onChange={(e) =>
                      updateWeakness(
                        index,
                        e.target.value
                      )
                    }
                    placeholder="مثلاً مصرف سوخت بالا"
                    className="h-[48px] flex-1 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#111]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeWeakness(
                        index
                      )
                    }
                    className="text-sm text-red-500"
                  >
                    حذف
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </AdminSection>

      {/* Technical Data */}

      <AdminSection
        title="اطلاعات فنی"
        description="مشخصات و عملکرد فنی خودرو"
      >
        {/* Specifications */}

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-semibold">
              مشخصات فنی
            </h4>

            <button
              type="button"
              onClick={
                addTechnicalSpecification
              }
              className="text-sm text-blue-600"
            >
              + افزودن
            </button>
          </div>

          <div className="space-y-3">
            {technicalSpecifications.map(
              (item, index) => (
                <TechnicalRow
                  key={index}
                  item={item}
                  onChange={(
                    field,
                    value
                  ) =>
                    updateTechnicalSpecification(
                      index,
                      field,
                      value
                    )
                  }
                  onRemove={() =>
                    removeTechnicalSpecification(
                      index
                    )
                  }
                />
              )
            )}
          </div>
        </div>

        {/* Performance */}

        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-semibold">
              عملکرد فنی
            </h4>

            <button
              type="button"
              onClick={
                addTechnicalPerformance
              }
              className="text-sm text-blue-600"
            >
              + افزودن
            </button>
          </div>

          <div className="space-y-3">
            {technicalPerformance.map(
              (item, index) => (
                <TechnicalRow
                  key={index}
                  item={item}
                  onChange={(
                    field,
                    value
                  ) =>
                    updateTechnicalPerformance(
                      index,
                      field,
                      value
                    )
                  }
                  onRemove={() =>
                    removeTechnicalPerformance(
                      index
                    )
                  }
                />
              )
            )}
          </div>
        </div>
      </AdminSection>

      {/* Settings */}

      <AdminSection
        title="تنظیمات"
        description="تنظیمات نمایش محصول"
      >
        <div className="flex flex-wrap gap-8">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={form.isPopular}
              onChange={(e) =>
                updateField(
                  "isPopular",
                  e.target.checked
                )
              }
              className="h-4 w-4"
            />

            محصول محبوب
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={(e) =>
                updateField(
                  "isNew",
                  e.target.checked
                )
              }
              className="h-4 w-4"
            />

            محصول جدید
          </label>
        </div>
      </AdminSection>

      {/* Submit */}

      <div className="sticky bottom-4 z-20 flex justify-end">
        <button
          type="submit"
          disabled={
            loading ||
            filtersLoading
          }
          className="min-w-[200px] rounded-2xl bg-red-600 px-8 py-4 text-sm font-bold text-white shadow-xl transition hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "در حال ایجاد محصول..."
            : "ایجاد محصول"}
        </button>
      </div>
    </form>
  );
}

/* ================================================= */
/* Dynamic Filters */
/* ================================================= */

function DynamicFilters({
  filters,
  selectedFilters,
  onChange,
}: {
  filters: Filter[];
  selectedFilters: Record<
    string,
    number | boolean
  >;
  onChange: (
    key: string,
    value: number | boolean
  ) => void;
}) {
  const activeFilters = filters
    .filter(
      (filter) => filter.isActive
    )
    .sort(
      (a, b) =>
        a.sortOrder - b.sortOrder
    );

  return (
    <AdminSection
      title="فیلترها"
      description="ویژگی‌های خودرو را انتخاب کنید"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {activeFilters.map(
          (filter) => {
            if (
              filter.type ===
              "BOOLEAN"
            ) {
              return (
                <BooleanFilter
                  key={filter.id}
                  filter={filter}
                  value={Boolean(
                    selectedFilters[
                      filter.key
                    ]
                  )}
                  onChange={(value) =>
                    onChange(
                      filter.key,
                      value
                    )
                  }
                />
              );
            }

            if (
              filter.type ===
              "SELECT"
            ) {
              return (
                <SelectFilter
                  key={filter.id}
                  filter={filter}
                  value={
                    selectedFilters[
                      filter.key
                    ]
                  }
                  onChange={(value) =>
                    onChange(
                      filter.key,
                      value
                    )
                  }
                />
              );
            }

            return null;
          }
        )}
      </div>
    </AdminSection>
  );
}

/* ================================================= */
/* Select Filter */
/* ================================================= */

function SelectFilter({
  filter,
  value,
  onChange,
}: {
  filter: Filter;
  value:
    | number
    | boolean
    | undefined;
  onChange: (
    value: number
  ) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#333]">
        {filter.title}
      </label>

      <select
        value={
          typeof value === "number"
            ? value
            : ""
        }
        onChange={(e) => {
          const value =
            Number(e.target.value);

          if (value > 0) {
            onChange(value);
          }
        }}
        className="h-[50px] w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 text-sm outline-none transition focus:border-[#111] focus:bg-white"
      >
        <option value="">
          انتخاب {filter.title}
        </option>

        {filter.options
          .filter(
            (option) =>
              option.isActive
          )
          .sort(
            (a, b) =>
              a.sortOrder -
              b.sortOrder
          )
          .map((option) => (
            <option
              key={option.id}
              value={option.id}
            >
              {option.label}
            </option>
          ))}
      </select>
    </div>
  );
}

/* ================================================= */
/* Boolean Filter */
/* ================================================= */

function BooleanFilter({
  filter,
  value,
  onChange,
}: {
  filter: Filter;
  value: boolean;
  onChange: (
    value: boolean
  ) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-[#fafafa] px-5 py-4">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) =>
          onChange(
            e.target.checked
          )
        }
        className="h-4 w-4"
      />

      <span className="text-sm font-medium text-[#333]">
        {filter.title}
      </span>
    </label>
  );
}

/* ================================================= */
/* Admin Section */
/* ================================================= */

function AdminSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-7">
        <h2 className="text-xl font-bold text-[#111]">
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

/* ================================================= */
/* Input */
/* ================================================= */

function Input({
  label,
  value,
  onChange,
  placeholder,
  dir,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl";
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#333]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        dir={dir}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="h-[50px] w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 text-sm outline-none transition focus:border-[#111] focus:bg-white"
      />
    </div>
  );
}

/* ================================================= */
/* Number Input */
/* ================================================= */

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (
    value: number
  ) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#333]">
        {label}
      </label>

      <input
        type="number"
        min={0}
        max={100}
        value={value}
        dir="ltr"
        onChange={(e) =>
          onChange(
            Number(e.target.value)
          )
        }
        className="h-[50px] w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 text-sm outline-none transition focus:border-[#111] focus:bg-white"
      />
    </div>
  );
}

/* ================================================= */
/* Textarea */
/* ================================================= */

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#333]">
        {label}
      </label>

      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm outline-none transition focus:border-[#111] focus:bg-white"
      />
    </div>
  );
}

/* ================================================= */
/* Technical Row */
/* ================================================= */

function TechnicalRow({
  item,
  onChange,
  onRemove,
}: {
  item: TechnicalDataItem;
  onChange: (
    field:
      | "label"
      | "value",
    value: string
  ) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-3">
      <input
        value={item.label}
        onChange={(e) =>
          onChange(
            "label",
            e.target.value
          )
        }
        placeholder="عنوان"
        className="h-[48px] w-1/3 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#111]"
      />

      <input
        value={item.value}
        onChange={(e) =>
          onChange(
            "value",
            e.target.value
          )
        }
        placeholder="مقدار"
        className="h-[48px] flex-1 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#111]"
      />

      <button
        type="button"
        onClick={onRemove}
        className="px-2 text-sm text-red-500"
      >
        حذف
      </button>
    </div>
  );
}