import { Car } from "../cars/CarGrid";

export default function TechnicalData({
  car,
}: {
  car: Car;
}) {

    if (!car.technicalData) {
    return null;
  }

  return (
    <section className="bg-[#f5f5f5] px-6 py-14">
      <div className="mx-auto grid max-w-[900px] gap-6 md:grid-cols-2">

        <TechnicalColumn
          title="مشخصات فنی"
          subtitle="TECHNICAL SPECIFICATIONS"
          data={car.technicalData.specifications}
        />

        <TechnicalColumn
          title="عملکرد فنی"
          subtitle="TECHNICAL PERFORMANCE"
          data={car.technicalData.performance}
        />

      </div>
    </section>
  );
}

function TechnicalColumn({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle: string;
  data: {
    label: string;
    value: string;
  }[];
}) {
  return (
    <div dir="rtl">

      {/* Heading */}

      <div className="flex items-center gap-4">

        <div className="text-right">
          <h2 className="text-xl font-black">
            {title}
          </h2>

          <p className="mt-1 text-[9px] tracking-[5px] text-red-500">
            {subtitle}
          </p>
        </div>

        <span className="h-px flex-1 bg-gray-200" />

      </div>

      {/* Data */}

      <div className="mt-5 overflow-hidden rounded-xl bg-white shadow-sm">

        {data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.label}
              className="flex min-h-[50px] items-center justify-between border-b border-gray-100 px-5 py-3 last:border-b-0"
            >
              <span className="text-right text-sm text-gray-500">
                {item.label}
              </span>

              <span className="text-left text-sm font-bold text-gray-800">
                {item.value}
              </span>
            </div>
          ))
        ) : (
          <div className="flex min-h-[50px] items-center justify-center px-5 text-sm text-gray-600">
            هیچ داده‌ای یافت نشد
          </div>
        )}

      </div>
    </div>
  );
}