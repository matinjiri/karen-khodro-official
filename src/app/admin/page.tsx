import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/lib/auth";
import ProductForm from "@/src/components/admin/ProductForm";
import Link from "next/link";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.isAdmin) {
    redirect("/my-account");
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f6f6f6]">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm text-gray-400">
              پنل مدیریت
            </p>

            <h1 className="text-3xl font-bold text-[#111]">
              داشبورد ادمین
            </h1>
          </div>

          <div className="rounded-2xl bg-white px-5 py-3 shadow-sm">
            <p className="text-xs text-gray-400">
              مدیر وارد شده
            </p>

            <p className="mt-1 font-medium text-[#111]">
              {user.firstName || user.phone}
            </p>
          </div>
        </div>

        {/* Dashboard */}
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="rounded-3xl bg-white p-4 shadow-sm">
            <nav className="space-y-2">

              <Link
                href="/admin"
                className="block w-full rounded-2xl bg-red-600 px-4 py-3 text-right text-sm font-medium text-white"
              >
                ایجاد محصول
              </Link>

              <Link
                href="/admin/products"
                className="block w-full rounded-2xl px-4 py-3 text-right text-sm text-gray-600 transition hover:bg-gray-100"
              >
                لیست محصولات
              </Link>

              <button
                type="button"
                className="w-full rounded-2xl px-4 py-3 text-right text-sm text-gray-600 transition hover:bg-gray-100"
              >
                کاربران
              </button>

            </nav>
          </aside>

          {/* Main */}
          <section className="space-y-6">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-400">
                  محصولات
                </p>

                <p className="mt-3 text-3xl font-bold text-[#111]">
                  ۰
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-400">
                  کاربران
                </p>

                <p className="mt-3 text-3xl font-bold text-[#111]">
                  ۰
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-400">
                  وضعیت سیستم
                </p>

                <p className="mt-3 font-semibold text-green-600">
                  فعال
                </p>
              </div>
            </div>

            {/* Create Product */}
            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#111]">
                  ایجاد محصول جدید
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  اطلاعات خودرو را وارد کنید.
                </p>
              </div>

              <ProductForm />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
