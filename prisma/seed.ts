import { prisma } from "@/src/lib/prisma";
import { PrismaClient } from "@prisma/client";


const products = [
  {
    slug: "tigard-x35-plus",
    name: "تیگارد X35 پلاس",
    code: "5691",

    image: "/images/cars/tigard-x35.jpg",
    description: "تیگارد X35 پلاس یک کراس‌اوور شهری مدرن است.",
    fullDescription:
      "تیگارد X35 پلاس با طراحی مدرن، امکانات مناسب و مصرف سوخت اقتصادی، گزینه‌ای مناسب برای استفاده شهری و خانوادگی است.",

    cashPrice: 1_500_000_000,
    transferPrice: 1_400_000_000,

    manufacturer: "تیگارد",
    productionYear: "1404",

    isPopular: true,
    isNew: true,

    filters: {
      usage: "city",
      brand: "tigard",
      bodyType: "crossover",
      country: "china",
      color: "white",
      fuel: "gasoline",
      status: "available",
    },
  },

  {
    slug: "mvm-x55-pro",
    name: "MVM X55 Pro",
    code: "1025",

    image: "/images/cars/mvm-x55.jpg",
    description: "MVM X55 Pro یک کراس‌اوور خانوادگی است.",
    fullDescription:
      "MVM X55 Pro با طراحی اسپرت، امکانات رفاهی مناسب و فضای کابین مطلوب، خودرویی مناسب برای استفاده خانوادگی است.",

    cashPrice: 1_800_000_000,
    transferPrice: 1_700_000_000,

    manufacturer: "MVM",
    productionYear: "1404",

    isPopular: true,
    isNew: true,

    filters: {
      usage: "family",
      brand: "mvm",
      bodyType: "suv",
      country: "china",
      color: "black",
      fuel: "gasoline",
      status: "available",
    },
  },

  {
    slug: "chery-arrizo-6-pro",
    name: "چری آریزو 6 پرو",
    code: "2048",

    image: "/images/cars/arrizo-6.jpg",
    description: "آریزو 6 پرو یک سدان خانوادگی مدرن است.",
    fullDescription:
      "چری آریزو 6 پرو با طراحی لوکس، کابین جادار و امکانات مناسب، انتخابی مناسب برای استفاده شهری و خانوادگی است.",

    cashPrice: 1_650_000_000,
    transferPrice: 1_550_000_000,

    manufacturer: "چری",
    productionYear: "1403",

    isPopular: true,
    isNew: false,

    filters: {
      usage: "family",
      brand: "chery",
      bodyType: "sedan",
      country: "china",
      color: "gray",
      fuel: "gasoline",
      status: "available",
    },
  },

  {
    slug: "toyota-corolla",
    name: "تویوتا کرولا",
    code: "3087",

    image: "/images/cars/corolla.jpg",
    description: "تویوتا کرولا یک سدان کم‌مصرف و قابل اعتماد است.",
    fullDescription:
      "تویوتا کرولا با مصرف سوخت مناسب، استهلاک پایین و کیفیت ساخت بالا، یکی از خودروهای محبوب بازار است.",

    cashPrice: 2_800_000_000,
    transferPrice: 2_650_000_000,

    manufacturer: "Toyota",
    productionYear: "2024",

    isPopular: true,
    isNew: false,

    filters: {
      usage: "city",
      brand: "toyota",
      bodyType: "sedan",
      country: "japan",
      color: "silver",
      fuel: "hybrid",
      status: "available",
    },
  },

  {
    slug: "kia-sportage",
    name: "کیا اسپورتیج",
    code: "4512",

    image: "/images/cars/sportage.jpg",
    description: "کیا اسپورتیج یک SUV مدرن و محبوب است.",
    fullDescription:
      "کیا اسپورتیج با طراحی جذاب، امکانات رفاهی مناسب و قابلیت استفاده خانوادگی، یکی از SUVهای محبوب بازار است.",

    cashPrice: 3_200_000_000,
    transferPrice: 3_050_000_000,

    manufacturer: "Kia",
    productionYear: "2024",

    isPopular: true,
    isNew: true,

    filters: {
      usage: "family",
      brand: "kia",
      bodyType: "suv",
      country: "korea",
      color: "blue",
      fuel: "gasoline",
      status: "reserved",
    },
  },
];

async function getFilterOption(
  filterKey: string,
  value: string
) {
  const option = await prisma.filterOption.findFirst({
    where: {
      value,
      isActive: true,
      filter: {
        key: filterKey,
        isActive: true,
      },
    },
  });

  if (!option) {
    throw new Error(
      `Filter option not found: ${filterKey}=${value}`
    );
  }

  return option;
}

async function main() {
  console.log("🌱 Starting product seed...");

  for (const product of products) {
    const filterEntries = Object.entries(product.filters);

    const filterOptions = await Promise.all(
      filterEntries.map(([filterKey, value]) =>
        getFilterOption(filterKey, value)
      )
    );

    const createdProduct = await prisma.product.upsert({
      where: {
        code: product.code,
      },

      update: {
        slug: product.slug,
        name: product.name,

        image: product.image,
        description: product.description,
        fullDescription: product.fullDescription,

        cashPrice: BigInt(product.cashPrice),
        transferPrice: BigInt(product.transferPrice),

        manufacturer: product.manufacturer,
        productionYear: product.productionYear,

        isPopular: product.isPopular,
        isNew: product.isNew,

        filters: {
          deleteMany: {},

          create: filterOptions.map((option) => ({
            filterOptionId: option.id,
          })),
        },
      },

      create: {
        slug: product.slug,
        name: product.name,
        code: product.code,

        image: product.image,
        description: product.description,
        fullDescription: product.fullDescription,

        cashPrice: BigInt(product.cashPrice),
        transferPrice: BigInt(product.transferPrice),

        manufacturer: product.manufacturer,
        productionYear: product.productionYear,

        isPopular: product.isPopular,
        isNew: product.isNew,

        filters: {
          create: filterOptions.map((option) => ({
            filterOptionId: option.id,
          })),
        },
      },
    });

    console.log(
      `✅ ${createdProduct.name} (${createdProduct.id})`
    );
  }

  console.log("🎉 Product seed completed.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });