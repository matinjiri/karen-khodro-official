import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";

export default async function MyAccountPage() {
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  const session = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    },
  });

  if (!session) {
    redirect("/login");
  }

  if (session.expiresAt < new Date()) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f7f7]">
      <div className="mx-auto max-w-[1000px] px-4 py-10">
        <div className="rounded-[28px] bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#111]">
            حساب کاربری
          </h1>

          <p className="mt-3 text-gray-500">
            خوش آمدید
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#f7f7f7] p-5">
              <p className="text-sm text-gray-400">
                شماره موبایل
              </p>

              <p
                dir="ltr"
                className="mt-2 font-medium text-[#111]"
              >
                {user.phone}
              </p>
            </div>

            <div className="rounded-2xl bg-[#f7f7f7] p-5">
              <p className="text-sm text-gray-400">
                نام
              </p>

              <p className="mt-2 font-medium text-[#111]">
                {user.firstName || "ثبت نشده"}
              </p>
            </div>

            <div className="rounded-2xl bg-[#f7f7f7] p-5">
              <p className="text-sm text-gray-400">
                نام خانوادگی
              </p>

              <p className="mt-2 font-medium text-[#111]">
                {user.lastName || "ثبت نشده"}
              </p>
            </div>

            <div className="rounded-2xl bg-[#f7f7f7] p-5">
              <p className="text-sm text-gray-400">
                نوع حساب
              </p>

              <p className="mt-2 font-medium text-[#111]">
                {user.isAdmin ? "مدیر" : "کاربر"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}   