import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { slug } = await params;

    // ==========================================
    // Product
    // ==========================================

    const product = await prisma.product.findUnique({
      where: {
        slug,
      },

      include: {
        // ======================================
        // Gallery
        // ======================================

        gallery: {
          orderBy: {
            sortOrder: "asc",
          },
        },

        // ======================================
        // Filters
        // ======================================

        filters: {
          include: {
            filterOption: {
              include: {
                filter: true,
              },
            },
          },
        },

        // ======================================
        // Technical Check
        // ======================================

        technicalCheck: {
          include: {
            items: true,
          },
        },

        // ======================================
        // Technical Data
        // ======================================

        technicalData: {
          include: {
            items: true,
          },
        },
      },
    });

    // ==========================================
    // Not Found
    // ==========================================

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "خودرو پیدا نشد.",
        },
        { status: 404 }
      );
    }

    // ==========================================
    // Convert Filters
    // ==========================================

    const filterValues: Record<
      string,
      {
        value: string;
        label: string;
      }
    > = {};

    for (const productFilter of product.filters) {
      const filter =
        productFilter.filterOption.filter;

      const option =
        productFilter.filterOption;

      filterValues[filter.key] = {
        value: option.value,
        label: option.label,
      };
    }

    // ==========================================
    // Product Data
    // ==========================================

    const data = {
      // ========================================
      // Basic
      // ========================================

      id: product.id,

      slug: product.slug,

      name: product.name,

      code: product.code,

      image: product.image,

      // ========================================
      // Gallery
      // ========================================

      gallery: product.gallery.map(
        (image) => image.url
      ),

      // ========================================
      // Description
      // ========================================

      description:
        product.description,

      fullDescription:
        product.fullDescription,

      // ========================================
      // Price
      // ========================================

      cashPrice:
        Number(product.cashPrice),

      transferPrice:
        Number(product.transferPrice),

      // ========================================
      // Filters
      // ========================================

      usage:
        filterValues.usage?.value ?? null,

      usageLabel:
        filterValues.usage?.label ?? null,

      brand:
        filterValues.brand?.value ?? null,

      brandLabel:
        filterValues.brand?.label ?? null,

      bodyType:
        filterValues.bodyType?.value ?? null,

      bodyTypeLabel:
        filterValues.bodyType?.label ?? null,

      country:
        filterValues.country?.value ?? null,

      countryLabel:
        filterValues.country?.label ?? null,

      color:
        filterValues.color?.value ?? null,

      colorLabel:
        filterValues.color?.label ?? null,

      fuel:
        filterValues.fuel?.value ?? null,

      fuelLabel:
        filterValues.fuel?.label ?? null,

      status:
        filterValues.status?.value ?? null,

      statusLabel:
        filterValues.status?.label ?? null,

      // ========================================
      // Product fields
      // ========================================

      manufacturer:
        product.manufacturer,

      productionYear:
        product.productionYear,

      // ========================================
      // Technical Check
      // ========================================

      technicalCheck:
        product.technicalCheck
          ? {
              purchaseValue:
                product.technicalCheck
                  .purchaseValue,

              quality:
                product.technicalCheck
                  .quality,

              performance:
                product.technicalCheck
                  .performance,

              fuelConsumption:
                product.technicalCheck
                  .fuelConsumption,

              strengths:
                product.technicalCheck.items
                  .filter(
                    (item) =>
                      item.type ===
                      "strength"
                  )
                  .map(
                    (item) =>
                      item.text
                  ),

              weaknesses:
                product.technicalCheck.items
                  .filter(
                    (item) =>
                      item.type ===
                      "weakness"
                  )
                  .map(
                    (item) =>
                      item.text
                  ),
            }
          : null,

      // ========================================
      // Technical Data
      // ========================================

      technicalData:
        product.technicalData
          ? {
              specifications:
                product.technicalData.items
                  .filter(
                    (item) =>
                      item.type ===
                      "specification"
                  )
                  .map((item) => ({
                    label:
                      item.label,

                    value:
                      item.value,
                  })),

              performance:
                product.technicalData.items
                  .filter(
                    (item) =>
                      item.type ===
                      "performance"
                  )
                  .map((item) => ({
                    label:
                      item.label,

                    value:
                      item.value,
                  })),
            }
          : null,

      // ========================================
      // Settings
      // ========================================

      isPopular:
        product.isPopular,

      isNew:
        product.isNew,

      // ========================================
      // Raw Filters
      // ========================================

      filters:
        product.filters.map(
          (productFilter) => ({
            id:
              productFilter
                .filterOption.id,

            key:
              productFilter
                .filterOption
                .filter.key,

            title:
              productFilter
                .filterOption
                .filter.title,

            value:
              productFilter
                .filterOption
                .value,

            label:
              productFilter
                .filterOption
                .label,
          })
        ),
    };

    // ==========================================
    // Response
    // ==========================================

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "GET /api/product/[slug] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "خطایی در دریافت محصول رخ داده است.",
      },
      {
        status: 500,
      }
    );
  }
}