import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const filters = await prisma.filter.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        options: {
          where: {
            isActive: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: filters,
    });
  } catch (error) {
    console.error(
      "GET /api/filters error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت فیلترها.",
      },
      {
        status: 500,
      }
    );
  }
}