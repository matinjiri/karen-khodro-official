import {
  CalendarDays,
  Car as CarIcon,
  Factory,
  Palette,
  Settings2,
  Tag,
} from "lucide-react";
import { Car } from "../cars/CarGrid";


export default function ProductInfo({
  car,
}: {
  car: Car;
}) {
  const minPrice = Math.min(
    car.cashPrice,
    car.transferPrice
  );

  const maxPrice = Math.max(
    car.cashPrice,
    car.transferPrice
  );

  const specifications = [
    {
      label: "شناسه",
      value: car.code,
      icon: Tag,
    },
    {
      label: "وضعیت",
      value: car.status,
      icon: CarIcon,
    },
    {
      label: "برند خودرو",
      value: car.brand,
      icon: Tag,
    },
    {
      label: "کشور سازنده",
      value: car.country,
      icon: Factory,
    },
    {
      label: "شرکت سازنده",
      value: car.manufacturer,
      icon: Factory,
    },
    {
      label: "نوع خودرو",
      value: car.bodyType,
      icon: CarIcon,
    },
    {
      label: "سال تولید",
      value: car.productionYear,
      icon: CalendarDays,
    },
    {
      label: "رنگ بدنه",
      value: car.color,
      icon: Palette,
    },
    {
      label: "سوخت خودرو",
      value: car.fuel,
      icon: Settings2,
    },
  ];

  return (
    <div className="text-right">

      {/* Product title */}

      <div className="rounded-2xl bg-red-600 px-7 py-4">
        <h1 className="text-2xl font-black text-white">
          {car.name}
        </h1>
      </div>

      <p className="mt-5 text-xs text-gray-400">
        اطلاعات
      </p>

      {/* Specifications */}

      <div className="mt-5 grid grid-cols-3 gap-3">
        {specifications.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="min-h-[70px] rounded-lg bg-[#f7f7f7] p-3 text-center"
            >
              <div className="flex items-center justify-center gap-1 text-[11px] text-gray-600">
                <Icon size={13} />

                <span>
                  {item.label}
                </span>
              </div>

              <p className="mt-2 text-sm font-black text-red-600">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Price */}

      <div className="mt-6 border-t border-gray-100 pt-6">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-bold text-red-600">
            محدوده قیمت خودرو:
          </span>

          <div className="flex items-center gap-2 text-sm">
            <span>
              {minPrice.toLocaleString("fa-IR")} تومان
            </span>

            <span>—</span>

            <span>
              {maxPrice.toLocaleString("fa-IR")} تومان
            </span>
          </div>
        </div>
      </div>

      {/* Purchase type */}

      <div className="mt-7">
        <label className="mb-2 block text-sm font-bold">
          نوع خرید
        </label>

        <button
          type="button"
          className="flex h-12 w-full items-center justify-between rounded-lg bg-[#f5f5f5] px-5 text-sm"
        >
          <span>
            انتخاب گزینه را انتخاب کنید
          </span>

          <span>⌄</span>
        </button>
      </div>

      {/* Actions */}

      <div className="mt-8 grid grid-cols-2 gap-3">
        <button className="rounded-lg bg-red-600 py-3 font-bold text-white">
          خرید حضوری
        </button>

        <button className="rounded-lg bg-red-600 py-3 font-bold text-white">
          درخواست مشاوره
        </button>
      </div>

    </div>
  );
}