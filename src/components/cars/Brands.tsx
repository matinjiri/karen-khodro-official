import Image from "next/image";

const brands = [
  {
    name: "Ferrari",
    faName: "فراری",
    logo: "/images/brands/ferrari.png",
    popular: true,
  },
  {
    name: "BMW",
    faName: "بی ام و",
    logo: "/images/brands/bmw.png",
    popular: false,
  },
  {
    name: "Benz",
    faName: "مرسدس بنز",
    logo: "/images/brands/benz.png",
    popular: false,
  },
  {
    name: "Audi",
    faName: "آئودی",
    logo: "/images/brands/audi.png",
    popular: false,
  },
  {
    name: "AstonMartin",
    faName: "استون مارتین",
    logo: "/images/brands/astonmartin.png",
    popular: false,
  },
  {
    name: "Nissan",
    faName: "نیسان",
    logo: "/images/brands/nissan.png",
    popular: false,
  },
  {
    name: "MVM",
    faName: "ام وی ام",
    logo: "/images/brands/mvm.png",
    popular: false,
  },
  {
    name: "Lamborghini",
    faName: "لامبورگینی",
    logo: "/images/brands/lamborghini.png",
    popular: false,
  },
  {
    name: "KIA",
    faName: "کیا",
    logo: "/images/brands/kia.png",
    popular: false,
  },
  {
    name: "Ford",
    faName: "فورد",
    logo: "/images/brands/ford.png",
    popular: false,
  },
];

function BrandCard({
  name,
  faName,
  logo,
}: {
  name: string;
  faName: string;
  logo: string;
}) {
  return (
    <div className="container-custom group flex h-[110px] items-center rounded-2xl bg-white px-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      
      {/* Name - Left */}
      <div className="flex-1 text-right">
        <h3 className="text-xl font-black text-[#191923]">
          {name}
        </h3>

        <p className="mt-2 text-sm font-medium text-red-600">
          {faName}
        </p>
      </div>

      <div className="relative h-[65px] w-[85px]">
        {/* The image can be enabled when assets exist */}
        {/* 
        <Image
          src={logo}
          alt={name}
          fill
          className="object-contain"
        />
        */}

        <div className="flex h-full items-center justify-center text-xs text-gray-400">
          LOGO
        </div>
      </div>
    </div>
  );
}

export default function Brands() {
  return (
    <section className="container-custom bg-[#f5f5f5] px-6 pb-20 pt-8">
      <div className="mx-auto max-w-[1500px]">
        {/* Section heading */}
        <div className="mb-10 border-b border-gray-200 pb-5">
          <div className="text-right">
            <h2 className="text-3xl font-black text-[#191923]">
              برندها
            </h2>

            <p className="mt-2 text-sm tracking-[8px] text-red-600">
              BRANDS
            </p>
          </div>
        </div>

        {/* Brand grid */}
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
          {brands.map((brand) => (
            <BrandCard
              key={brand.name}
              name={brand.name}
              faName={brand.faName}
              logo={brand.logo}
            />
          ))}
        </div>
      </div>
    </section>
  );
}