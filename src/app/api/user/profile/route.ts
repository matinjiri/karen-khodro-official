import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "وارد حساب کاربری نشده‌اید.",
        },
        { status: 401 }
      );
    }

    const session = await prisma.session.findUnique({
      where: {
        token,
      },
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "جلسه کاربری معتبر نیست.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();

    if (!firstName || !lastName) {
      return NextResponse.json(
        {
          success: false,
          message: "نام و نام خانوادگی الزامی است.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: {
        id: session.userId,
      },
      data: {
        firstName,
        lastName,
      },
    });

    return NextResponse.json({
      success: true,
      message: "اطلاعات با موفقیت ذخیره شد.",
      data: {
        id: user.id,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در بروزرسانی اطلاعات.",
      },
      { status: 500 }
    );
  }
}