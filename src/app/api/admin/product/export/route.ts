import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { prisma } from "@/src/lib/prisma";
import { adminGuard } from "@/src/lib/admin";

export async function GET() {
  try {
    // ==========================================
    // Admin Guard
    // ==========================================

    const { response } = await adminGuard();

    if (response) {
      return response;
    }

    // ==========================================
    // Get Products
    // ==========================================

    const products = await prisma.product.findMany({
      orderBy: {
        id: "asc",
      },

      select: {
        code: true,
        name: true,
        slug: true,
        cashPrice: true,
        transferPrice: true,
      },
    });

    // ==========================================
    // Excel Rows
    // ==========================================

    const rows = products.map((product) => ({
      code: product.code,

      name: product.name,

      slug: product.slug,

      cashPrice:
        product.cashPrice.toString(),

      transferPrice:
        product.transferPrice.toString(),
    }));

    // ==========================================
    // Create Worksheet
    // ==========================================

    const worksheet =
      XLSX.utils.json_to_sheet(rows);

    // ==========================================
    // Create Workbook
    // ==========================================

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Products"
    );

    // ==========================================
    // Column Widths
    // ==========================================

    worksheet["!cols"] = [
      {
        wch: 20,
      },
      {
        wch: 35,
      },
      {
        wch: 35,
      },
      {
        wch: 20,
      },
      {
        wch: 20,
      },
    ];

    // ==========================================
    // Generate Excel
    // ==========================================

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // ==========================================
    // Response
    // ==========================================

    return new NextResponse(buffer, {
      status: 200,

      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "Content-Disposition":
          'attachment; filename="products.xlsx"',

        "Cache-Control":
          "no-store",
      },
    });
  } catch (error) {
    console.error(
      "GET /api/admin/products/export error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "خطایی در خروجی گرفتن محصولات رخ داده است.",
      },
      {
        status: 500,
      }
    );
  }
}