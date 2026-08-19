import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-visible">
      {/* Hero background */}
      <div
        className="relative h-[500px] overflow-hidden bg-red-700"
        style={{
          background:
            "radial-gradient(circle at 50% 100%, #ff1616 0%, #b40000 45%, #450000 100%)",
        }}
      >
        {/* Dark texture overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Road lines */}
        <div className="absolute bottom-[-80px] left-[22%] h-[250px] w-[3px] rotate-[62deg] bg-white/80" />
        <div className="absolute bottom-[-80px] right-[22%] h-[250px] w-[3px] rotate-[-62deg] bg-white/80" />

        {/* Center title */}
        <div className="relative z-10 mx-auto flex max-w-[1600px] justify-center">
          <div className="mt-[70px] bg-black/35 px-16 py-10 text-center backdrop-blur-[2px]">
            <h1 className="text-4xl font-black text-white md:text-5xl">
              آرشیو <span className="font-normal">خودروها</span>
            </h1>

            <p className="mt-4 text-lg text-white">
              تمامی خودروهای ما را اینجا مشاهده کنید!
            </p>
          </div>
        </div>

        {/* Car */}
        <div className="absolute bottom-[-95px] left-1/2 z-20 w-[420px] -translate-x-1/2">
          <div className="flex h-[270px] items-center justify-center bg-white/10">
            {/* Replace this with the real car image */}
            <div className="text-center">
              <div className="text-[130px]">🚗</div>
              <span className="text-sm text-white/60">
                CAR IMAGE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Curved bottom */}
      <div className="relative z-10 -mt-[1px] h-[100px] overflow-hidden">
        <div className="absolute -top-[80px] left-[-5%] h-[180px] w-[110%] rounded-[50%] bg-[#f5f5f5]" />
      </div>
    </section>
  );
}