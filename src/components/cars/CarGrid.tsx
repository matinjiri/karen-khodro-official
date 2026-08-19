import CarCard from "./CarCard";

export type CarUsage =
  | "city"
  | "family"
  | "sport";

export type CarBrand =
  | "mvm"
  | "lamaco"
  | "lamari"
  | "bmw"
  | "mercedes";

export type CarBodyType =
  | "crossover"
  | "suv"
  | "sedan";

export type TechnicalCheck = {
  purchaseValue: number;
  quality: number;
  performance: number;
  fuelConsumption: number;

  strengths: string[];
  weaknesses: string[];
};

export type TechnicalData = {
  specifications: {
    label: string;
    value: string;
  }[];

  performance: {
    label: string;
    value: string;
  }[];
};

export type Car = {
  id: number;
  slug: string;
  name: string;
  code: string;

  image: string;
  gallery: string[];

  description: string;
  fullDescription: string;

  cashPrice: number;
  transferPrice: number;

  usage: CarUsage;
  brand: CarBrand;
  bodyType: CarBodyType;

  country: string;
  manufacturer: string;
  productionYear: string;
  color: string;
  fuel: string;
  status: string;

  technicalCheck: TechnicalCheck;
  technicalData: TechnicalData;

  isPopular: boolean;
  isNew: boolean;
};

export default function CarGrid({
  cars,
}: {
  cars: Car[];
}) {
  if (cars.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-white">
        <div className="text-center">
          <h3 className="text-xl font-bold text-[#17171f]">
            نتیجه‌ای یافت نشد
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            خودرویی با این محدوده قیمت پیدا نشد.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <CarCard
          key={car.id}
          car={car}
        />
      ))}
    </div>
  );
}