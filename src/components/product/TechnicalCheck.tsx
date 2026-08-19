import { Car } from "../cars/CarGrid";

export default function TechnicalCheck({
  car,
}: {
  car: Car;
}) {

      if (!car.technicalCheck) {
    return null;
  }
  const checks = [
    {
      title: "ارزش خرید",
      value: car.technicalCheck.purchaseValue,
    },
    {
      title: "کیفیت",
      value: car.technicalCheck.quality,
    },
    {
      title: "کارایی",
      value: car.technicalCheck.performance,
    },
    {
      title: "مصرف سوخت",
      value: car.technicalCheck.fuelConsumption,
    },
  ];

  return (
    <section className="bg-[#f5f5f5] px-6 py-4">
      <div className="relative mx-auto max-w-[900px] overflow-hidden rounded-2xl bg-[#570000] px-7 py-8 text-white">

        <div className="absolute inset-0 bg-[url('/images/footer-bg.jpg')] bg-cover bg-center opacity-30" />

        <div className="relative">

          {/* Heading */}

          <div className="flex items-center gap-5">
            <span className="h-px flex-1 bg-red-600" />

            <div className="text-center">
              <h2 className="text-2xl font-black">
                بررسی فنی
              </h2>

              <p className="mt-1 text-[10px] tracking-[6px] text-red-400">
                TECHNICAL CHECK
              </p>
            </div>

            <span className="h-px flex-1 bg-red-600" />
          </div>

          {/* Scores */}

          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {checks.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center"
              >
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/40">
                  <div className="text-center">
                    <div className="text-xl font-black">
                      {item.value}٪
                    </div>

                    <div className="mt-2 text-xs">
                      {item.title}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Results */}

          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* Strengths */}

            <div>
              <div className="mb-2 text-right text-sm font-bold">
                <span className="text-green-500">
                  ✓
                </span>{" "}
                نقاط قوت
              </div>

              <div className="rounded-xl bg-white/10 px-5 py-3 text-right text-sm leading-8">
                {car.technicalCheck.strengths.length > 0 ? (
                  <ul className="space-y-1">
                    {car.technicalCheck.strengths.map(
                      (item, index) => (
                        <li key={index}>
                          • {item}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  "هیچ داده‌ای یافت نشد"
                )}
              </div>
            </div>

            {/* Weaknesses */}

            <div>
              <div className="mb-2 text-right text-sm font-bold">
                <span className="text-red-500">
                  ×
                </span>{" "}
                نقاط ضعف
              </div>

              <div className="rounded-xl bg-white/10 px-5 py-3 text-right text-sm leading-8">
                {car.technicalCheck.weaknesses.length > 0 ? (
                  <ul className="space-y-1">
                    {car.technicalCheck.weaknesses.map(
                      (item, index) => (
                        <li key={index}>
                          • {item}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  "هیچ داده‌ای یافت نشد"
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}