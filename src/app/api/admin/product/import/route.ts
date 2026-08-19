import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/src/lib/prisma";
import { adminGuard } from "@/src/lib/admin";

type ExcelRow = {
  code?: unknown;
  name?: unknown;
  slug?: unknown;
  cashPrice?: unknown;
  transferPrice?: unknown;
};

export async function POST(
  request: NextRequest
) {
  try {
    // ==========================================
    // Admin Guard
    // ==========================================

    const { response } =
      await adminGuard();

    if (response) {
      return response;
    }

    // ==========================================
    // Get File
    // ==========================================

    const formData =
      await request.formData();

    const file =
      formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "فایل Excel ارسال نشده است.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Validate File Type
    // ==========================================

    const fileName =
      file.name.toLowerCase();

    if (
      !fileName.endsWith(".xlsx") &&
      !fileName.endsWith(".xls")
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "فرمت فایل باید Excel باشد.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Read Excel
    // ==========================================

    const buffer =
      Buffer.from(
        await file.arrayBuffer()
      );

    const workbook =
      XLSX.read(buffer, {
        type: "buffer",
      });

    if (
      workbook.SheetNames.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "فایل Excel خالی است.",
        },
        { status: 400 }
      );
    }

    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    const rows =
      XLSX.utils.sheet_to_json<ExcelRow>(
        sheet,
        {
          defval: "",
        }
      );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "هیچ رکوردی در فایل Excel پیدا نشد.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Normalize Rows
    // ==========================================

    const normalizedRows = rows.map(
      (row, index) => {
        const code =
          String(row.code ?? "").trim();

        const name =
          String(row.name ?? "").trim();

        const slug =
          String(row.slug ?? "").trim();

        const cashPrice =
          String(
            row.cashPrice ?? ""
          ).trim();

        const transferPrice =
          String(
            row.transferPrice ?? ""
          ).trim();

        return {
          rowNumber: index + 2,
          code,
          name,
          slug,
          cashPrice,
          transferPrice,
        };
      }
    );

    // ==========================================
    // Validate Required Fields
    // ==========================================

    const validationErrors: string[] =
      [];

    for (const row of normalizedRows) {
      if (!row.code) {
        validationErrors.push(
          `ردیف ${row.rowNumber}: کد محصول خالی است.`
        );
      }

      if (!row.name) {
        validationErrors.push(
          `ردیف ${row.rowNumber}: نام محصول خالی است.`
        );
      }

      if (!row.slug) {
        validationErrors.push(
          `ردیف ${row.rowNumber}: slug خالی است.`
        );
      }

      if (!row.cashPrice) {
        validationErrors.push(
          `ردیف ${row.rowNumber}: قیمت نقدی خالی است.`
        );
      }

      if (!row.transferPrice) {
        validationErrors.push(
          `ردیف ${row.rowNumber}: قیمت انتقال خالی است.`
        );
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "اطلاعات Excel معتبر نیست.",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Duplicate Codes
    // ==========================================

    const codes =
      normalizedRows.map(
        (row) => row.code
      );

    const duplicateCodes =
      codes.filter(
        (code, index) =>
          codes.indexOf(code) !== index
      );

    const uniqueDuplicateCodes = [
      ...new Set(duplicateCodes),
    ];

    if (
      uniqueDuplicateCodes.length > 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "کدهای تکراری در فایل Excel وجود دارد.",
          codes:
            uniqueDuplicateCodes,
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Validate Prices
    // ==========================================

    const parsedRows = normalizedRows.map(
      (row) => {
        const cashPrice =
          Number(row.cashPrice);

        const transferPrice =
          Number(
            row.transferPrice
          );

        return {
          ...row,
          cashPrice,
          transferPrice,
        };
      }
    );

    const invalidPrices =
      parsedRows.filter(
        (row) =>
          !Number.isSafeInteger(
            row.cashPrice
          ) ||
          row.cashPrice < 0 ||
          !Number.isSafeInteger(
            row.transferPrice
          ) ||
          row.transferPrice < 0
      );

    if (invalidPrices.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "یک یا چند قیمت نامعتبر است.",
          rows: invalidPrices.map(
            (row) => row.rowNumber
          ),
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Find Existing Products
    // ==========================================

    const existingProducts =
      await prisma.product.findMany({
        where: {
          code: {
            in: codes,
          },
        },

        select: {
          id: true,
          code: true,
        },
      });

    const existingCodes =
      new Set(
        existingProducts.map(
          (product) => product.code
        )
      );

    // ==========================================
    // Missing Codes
    // ==========================================

    const missingCodes =
      codes.filter(
        (code) =>
          !existingCodes.has(code)
      );

    if (missingCodes.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "برخی از کدهای موجود در Excel در سیستم وجود ندارند. هیچ تغییری اعمال نشد.",
          missingCodes,
        },
        { status: 404 }
      );
    }

    // ==========================================
    // Update Everything Transactionally
    // ==========================================

    const result =
      await prisma.$transaction(
        async (tx) => {
          let updated = 0;

          for (const row of parsedRows) {
            await tx.product.update({
              where: {
                code: row.code,
              },

              data: {
                name: row.name,

                slug: row.slug,

                cashPrice:
                  BigInt(
                    row.cashPrice
                  ),

                transferPrice:
                  BigInt(
                    row.transferPrice
                  ),
              },
            });

            updated++;
          }

          return {
            updated,
          };
        }
      );

    // ==========================================
    // Success
    // ==========================================

    return NextResponse.json({
      success: true,

      message:
        "محصولات با موفقیت بروزرسانی شدند.",

      updated:
        result.updated,
    });
  } catch (error) {
    console.error(
      "POST /api/product/import error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "خطایی هنگام وارد کردن Excel رخ داد. هیچ تغییری اعمال نشد.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      {
        status: 500,
      }
    );
  }
}