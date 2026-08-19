import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("session")?.value;

    if (token) {
      await prisma.session.deleteMany({
        where: {
          token,
        },
      });
    }

    const response = NextResponse.json({
      success: true,
      message: "با موفقیت خارج شدید.",
    });

    response.cookies.delete("session");

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در خروج.",
      },
      { status: 500 }
    );
  }
}