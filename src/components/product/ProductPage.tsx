import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductDescription from "./ProductDescription";
import TechnicalCheck from "./TechnicalCheck";
import TechnicalData from "./TechnicalData";
import ProductGallerySection from "./ProductGallerySection";
import { Car } from "../cars/CarGrid";

export default async function ProductPage({
  slug,
}: {
  slug: string;
}) {
  const response = await fetch(
    `http://localhost:3000/api/product/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return (
      <main className="flex min-h-[500px] items-center justify-center bg-[#f5f5f5]">
        <p className="text-lg font-bold">
          خودرو پیدا نشد.
        </p>
      </main>
    );
  }

  const result: {
    success: boolean;
    data: Car;
  } = await response.json();

  const car = result.data;

  return (
    <main className="bg-[#f5f5f5]">

      {/* Product top section */}

      <section className="bg-white px-6 py-12">
        <div className="mx-auto grid max-w-[900px] grid-cols-1 gap-7 lg:grid-cols-2">

          <ProductGallery car={car} />

          <ProductInfo car={car} />

        </div>
      </section>


      <ProductDescription car={car} />


      <TechnicalCheck car={car} />


      <TechnicalData car={car} />


      {/* <ProductGallerySection car={car} /> */}

    </main>
  );
}