export default function SimilarProducts() {
  return (
    <section className="bg-[#f5f5f5] px-6 pb-20">
      <div className="mx-auto max-w-[900px]">
        <div className="flex items-end justify-between border-b border-gray-200 pb-5">
          <button className="text-sm font-bold text-red-600">
            ‹ موارد
            <br />
            بیشتر
          </button>

          <div className="text-right">
            <h2 className="text-2xl font-black">
              محصولات مشابه
            </h2>

            <p className="mt-1 text-[10px] tracking-[6px] text-red-500">
              SAME PRODUCTS
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}