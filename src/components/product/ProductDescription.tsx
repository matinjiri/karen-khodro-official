import { FileText } from "lucide-react";
import { Car } from "../cars/CarGrid";

export default function ProductDescription({
  car,
}: {
  car: Car;
}) {
  return (
    <section className="bg-[#f5f5f5] px-6 py-10">
      <div className="mx-auto max-w-[900px]">

        {/* Title */}

        <div className="mb-5 flex items-center justify-end gap-2">
          <h2 className="text-xl font-black text-gray-900">
            معرفی خودرو
          </h2>

          <FileText
            size={22}
            className="text-red-600"
          />
        </div>

        {/* Short description */}

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-right text-sm font-bold leading-8 text-gray-800">
            {car.description}
          </p>
        </div>

        {/* Full description */}

        <div className="mt-5 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-right text-base font-black text-gray-900">
            توضیحات کامل
          </h3>

          <p className="text-right text-sm leading-8 text-gray-600">
            {car.fullDescription}
          </p>
        </div>

      </div>
    </section>
  );
}