import { Menu, Search, ShoppingCart, UserRound } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white" >
      {/* Top phone bar */}
      <div className="h-[38px] rounded-b-[35px] bg-red-600 px-10 text-white">
        <div
          className="mx-auto flex h-full max-w-[1600px] items-center justify-start gap-3 text-sm font-bold">
          <span className="text-lg">☎</span>
          <span>۰۲۱-۷۷۴۸۱۷۶۶</span>
        </div>
      </div>

      {/* Main navigation */}
      <div className="h-[100px] border-b border-gray-100">
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-10">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-3xl font-black leading-none">
                کارن خودرو
              </div>

              <div className="mt-1 text-sm font-bold text-red-600">
                (شرق)
              </div>
            </div>

            <div className="flex h-14 w-14 items-center justify-center">
              <div className="text-5xl font-black text-red-600">K</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden items-center gap-10 lg:flex">
            <Link
              href="/"
              className="text-[16px] font-medium text-gray-700 transition hover:text-red-600"
            >
              صفحه اصلی
            </Link>

            <Link
              href="/car"
              className="relative py-9 text-[16px] font-bold text-gray-900"
            >
              خودرو ها

              <span className="absolute bottom-0 right-0 h-[3px] w-full rounded-full bg-red-600" />
            </Link>

            <a
              href="#"
              className="flex items-center gap-2 text-[16px] font-medium text-gray-700 hover:text-red-600"
            >
              خدمات ما
              <span>⌄</span>
            </a>

            <a
              href="#"
              className="text-[16px] font-medium text-gray-700 hover:text-red-600"
            >
              درباره ما
            </a>

            <a
              href="#"
              className="text-[16px] font-medium text-gray-700 hover:text-red-600"
            >
              تماس با ما
            </a>

            <a
              href="#"
              className="flex items-center gap-2 text-[16px] font-medium text-gray-700 hover:text-red-600"
            >
              اخبار
              <span>⌄</span>
            </a>

            <a
              href="#"
              className="text-[16px] font-medium text-gray-700 hover:text-red-600"
            >
              سوالات متداول
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2" dir="ltr">
            <button className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-600 text-white">
              <UserRound size={21} />
            </button>

            {/* <button className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-red-600 text-white">
              <ShoppingCart size={21} />

              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] text-white">
                0
              </span>
            </button>

            <button className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-600 text-white">
              <Search size={21} />
            </button> */}

            <button className="flex h-11 w-11 items-center justify-center rounded-lg border border-red-600 text-red-600 lg:hidden">
              <Menu size={23} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}