import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { generateSessionToken } from "@/src/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const phone = body.phone?.trim();
    const code = body.code?.trim();

    if (!phone || !code) {
      return NextResponse.json(
        {
          success: false,
          message: "شماره موبایل و کد تأیید الزامی است.",
        },
        { status: 400 }
      );
    }

    // Find latest valid OTP
    const otp = await prisma.otpCode.findFirst({
      where: {
        phone,
        code,
        used: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otp) {
      return NextResponse.json(
        {
          success: false,
          message: "کد تأیید اشتباه است.",
        },
        { status: 400 }
      );
    }

    // Check expiration
    if (otp.expiresAt < new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "کد تأیید منقضی شده است.",
        },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await prisma.otpCode.update({
      where: {
        id: otp.id,
      },
      data: {
        used: true,
      },
    });

    // Find existing user or create a new one
    const user = await prisma.user.upsert({
      where: {
        phone,
      },
      update: {},
      create: {
        phone,
      },
    });

    // Create session
    const token = generateSessionToken();

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ),
      },
    });

    // Response
    const response = NextResponse.json({
      success: true,
      message: "ورود موفق بود.",
      data: {
        user: {
          id: user.id,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
        },
      },
    });

    // HttpOnly session cookie
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Verify OTP error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در ورود.",
      },
      { status: 500 }
    );
  }
}