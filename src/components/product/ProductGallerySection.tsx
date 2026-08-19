import Image from "next/image";

const gallery = [
  "/images/cars/quick-gxr-2.jpg",
  "/images/cars/quick-gxr-3.jpg",
  "/images/cars/quick-gxr-4.jpg",
  "/images/cars/quick-gxr-5.jpg",
  "/images/cars/quick-gxr-6.jpg",
  "/images/cars/quick-gxr-1.jpg",
  "/images/cars/quick-gxr-7.jpg",
  "/images/cars/quick-gxr-8.jpg",
  "/images/cars/quick-gxr-9.jpg",
];

export default function ProductGallerySection() {
  return (
    <section className="bg-[#f5f5f5] px-6 pb-16">
      <div className="mx-auto max-w-[900px]">
        <div className="flex items-end gap-5">
          <span className="mb-2 h-px flex-1 bg-gray-200" />

          <div className="text-right">
            <h2 className="text-2xl font-black">
              گالری تصاویر
            </h2>

            <p className="mt-1 text-[10px] tracking-[6px] text-red-500">
              GALLERY
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          {gallery.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="relative aspect-[1.45] overflow-hidden rounded-xl bg-white"
            >
              <Image
                src={image}
                alt={`تصویر ${index + 1}`}
                fill
                className="object-cover transition duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}