import {
  MessageCircle,
  Smartphone,
  MapPin,
  Phone,
  Send,

} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#111019] text-white">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('/images/footer-bg.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-[#111019]/80" />

      <div className="container-custom relative mx-auto max-w-[1500px] px-6 py-20">
        {/* Top footer columns */}
        <div className="grid gap-14 lg:grid-cols-4">

          {/* Company */}
          <div className="text-right">
            <div className="mb-7">
              <h2 className="text-3xl font-black">
                کارن خودرو
              </h2>

              <span className="font-bold text-red-600">
                (شرق)
              </span>
            </div>

            <div className="leading-8 text-gray-300">
              <p>
                کارن خودرو شرق از سال ۱۳۹۸ در زمینه خرید و
                فروش انواع خودروهای صفر و کارکرده داخلی و
                خارجی فعالیت می‌کند.
              </p>

              <p className="mt-4">
                با ارائه خدمات حرفه‌ای و تخصصی در حوزه خودرو،
                همراه شما هستیم.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <FooterTitle title="راه‌های ارتباطی با ما" />

            <div className="space-y-5 text-sm text-gray-300">

              <div className="flex items-start gap-4">
                <MapPin
                  className="mt-1 shrink-0 text-red-600"
                  size={22}
                />

                <span>
                  آدرس: تهران، پیروزی، خیابان پنچ نیرو
                  هوایی، نبش کوچه ۵۳/۳، پلاک ۳۴، واحد ۵
                </span>
              </div>

              <div className="flex items-center gap-4 border-b border-red-600/60 pb-4">
                <Phone
                  className="shrink-0 text-red-600"
                  size={21}
                />

                <span dir="ltr">
                  ۰۲۱-۷۷۴۸۱۷۶۶
                </span>
              </div>

              <div className="flex items-center gap-4 border-b border-red-600/60 pb-4">
                <Smartphone
                  className="shrink-0 text-red-600"
                  size={21}
                />

                <span>
                  مدیریت: ۰۹۱۲۲۲۶۹۹۷۱
                </span>
              </div>

              <div className="flex items-center gap-4 border-b border-red-600/60 pb-4">
                <Smartphone
                  className="shrink-0 text-red-600"
                  size={21}
                />

                <span>
                  فروش: ۰۹۳۸۲۸۶۲۹۸۱۰
                </span>
              </div>

              <div className="flex items-center gap-4 border-b border-red-600/60 pb-4">
                <Smartphone
                  className="shrink-0 text-red-600"
                  size={21}
                />

                <span>
                  سند: ۰۹۱۹۵۲۳۶۱۸
                </span>
              </div>

            </div>
          </div>

          {/* Useful links */}
          <div>
            <FooterTitle title="لینک‌های مفید" />

            <nav className="flex flex-col gap-5 text-gray-300">
              <a
                href="#"
                className="transition hover:text-red-600"
              >
                نمایندگی
              </a>

              <a
                href="#"
                className="transition hover:text-red-600"
              >
                حریم خصوصی
              </a>

              <a
                href="#"
                className="transition hover:text-red-600"
              >
                سوالات متداول
              </a>

              <a
                href="#"
                className="transition hover:text-red-600"
              >
                تماس با پشتیبانی
              </a>

              <a
                href="#"
                className="transition hover:text-red-600"
              >
                وبلاگ
              </a>
            </nav>
          </div>

          {/* Licenses / social */}
          <div>
            <FooterTitle title="مجوزهای فعالیت" />

            <div className="flex min-h-[180px] items-center justify-center">
              <div className="text-center">
                <a
                  href="https://trustseal.enamad.ir/?id=5497475&Code=V7QMHorgP592ZaalzyyZWxUwULV3Oy5T"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="mx-auto flex h-36 w-28 items-center justify-center overflow-hidden rounded-xl p-2 transition hover:scale-105">
                    <img
                      src="https://karenkhodroshargh.com/wp-content/uploads/2023/07/Untitled-7-247x300-1.png"
                      alt="نماد اعتماد الکترونیکی"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </a>
              </div>
            </div>
            <div className="mt-8">
              <p className="mb-5 text-center text-sm font-bold">
                در فضای مجازی با ما در ارتباط باشید
              </p>

              <div
                className="flex justify-center gap-5"
                dir="ltr"
              >
                <SocialIcon>
                  <MessageCircle size={22} />
                </SocialIcon>

                <SocialIcon>
                  <MessageCircle size={22} />
                </SocialIcon>

                <SocialIcon>
                  <Send size={22} />
                </SocialIcon>

                <SocialIcon>
                  <span className="text-lg font-bold">
                    ●
                  </span>
                </SocialIcon>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-red-600" />

        {/* Copyright */}
        <div className="rounded-2xl border border-red-600 px-6 py-6 text-center text-sm text-gray-200">
          تمامی حقوق این وبسایت متعلق به سایت کارن خودرو شرق
          می‌باشد.
        </div>
      </div>
    </footer>
  );
}

function FooterTitle({
  title,
}: {
  title: string;
}) {
  return (
    <div className="mb-8 flex items-center gap-5">
      <span className="h-px flex-1 bg-red-600" />

      <h3 className="whitespace-nowrap text-xl font-black">
        {title}
      </h3>

      <span className="h-px flex-1 bg-red-600" />
    </div>
  );
}

function SocialIcon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <a
      href="#"
      className="flex h-11 w-11 items-center justify-center rounded-full text-red-600 transition hover:bg-red-600 hover:text-white"
    >
      {children}
    </a>
  );
}