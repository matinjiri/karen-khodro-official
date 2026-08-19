import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { generateOtp } from "@/src/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const phone = body.phone?.trim();

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          message: "شماره موبایل الزامی است.",
        },
        { status: 400 }
      );
    }

    const code = generateOtp();

    // Remove previous unused OTPs
    await prisma.otpCode.updateMany({
      where: {
        phone,
        used: false,
      },
      data: {
        used: true,
      },
    });

    await prisma.otpCode.create({
      data: {
        phone,
        code,
        expiresAt: new Date(Date.now() + 2 * 60 * 1000),
      },
    });

    // TODO:
    // Send `code` through SMS provider here.

    console.log(`OTP for ${phone}: ${code}`);

    return NextResponse.json({
      success: true,
      message: "کد تأیید ارسال شد.",
    });
  } catch (error) {
    console.error("Send OTP error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در ارسال کد تأیید.",
      },
      { status: 500 }
    );
  }
}