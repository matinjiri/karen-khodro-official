import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { adminGuard } from "@/src/lib/admin";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // ==========================================
    // Query Params
    // ==========================================

    const search =
      searchParams.get("search")?.trim() || undefined;

    const sort =
      searchParams.get("sort") || undefined;

    const minPriceParam =
      searchParams.get("minPrice");

    const maxPriceParam =
      searchParams.get("maxPrice");

    // ==========================================
    // Pagination
    // ==========================================

    const pageParam = Number(
      searchParams.get("page") ?? DEFAULT_PAGE
    );

    const limitParam = Number(
      searchParams.get("limit") ?? DEFAULT_LIMIT
    );

    const page =
      Number.isFinite(pageParam) && pageParam > 0
        ? Math.floor(pageParam)
        : DEFAULT_PAGE;

    const limit =
      Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(Math.floor(limitParam), MAX_LIMIT)
        : DEFAULT_LIMIT;

    // ==========================================
    // Price
    // ==========================================

    const minPrice =
      minPriceParam !== null
        ? Number(minPriceParam)
        : undefined;

    const maxPrice =
      maxPriceParam !== null
        ? Number(maxPriceParam)
        : undefined;

    if (
      (minPrice !== undefined &&
        !Number.isFinite(minPrice)) ||
      (maxPrice !== undefined &&
        !Number.isFinite(maxPrice))
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "محدوده قیمت نامعتبر است.",
        },
        { status: 400 }
      );
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "حداقل قیمت نمی‌تواند بیشتر از حداکثر قیمت باشد.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Dynamic Filters
    // ==========================================
    //
    // مثال:
    //
    // ?usage=city
    // ?brand=mvm
    // ?bodyType=suv
    //
    // یا:
    //
    // ?usage=city&brand=mvm&bodyType=suv
    //
    // کلید باید از Filter.key بیاید.
    // ==========================================

    const filters: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      const ignoredKeys = [
        "search",
        "sort",
        "page",
        "limit",
        "minPrice",
        "maxPrice",
      ];

      if (!ignoredKeys.includes(key) && value.trim()) {
        filters[key] = value.trim();
      }
    });

    // ==========================================
    // Where
    // ==========================================

    const where: any = {};

    // ==========================================
    // Search
    // ==========================================

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          code: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          manufacturer: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // ==========================================
    // Dynamic DB Filters
    // ==========================================

    const filterConditions: any[] = [];

    for (const [filterKey, filterValue] of Object.entries(filters)) {
      filterConditions.push({
        filters: {
          some: {
            filterOption: {
              value: filterValue,

              filter: {
                key: filterKey,
                isActive: true,
              },

              isActive: true,
            },
          },
        },
      });
    }

    if (filterConditions.length > 0) {
      where.AND = [
        ...(where.AND ?? []),
        ...filterConditions,
      ];
    }

    // ==========================================
    // Price Filter
    // ==========================================

    if (
      minPrice !== undefined ||
      maxPrice !== undefined
    ) {
      const priceConditions: any[] = [];

      if (
        minPrice !== undefined &&
        maxPrice !== undefined
      ) {
        priceConditions.push(
          {
            cashPrice: {
              gte: BigInt(minPrice),
              lte: BigInt(maxPrice),
            },
          },
          {
            transferPrice: {
              gte: BigInt(minPrice),
              lte: BigInt(maxPrice),
            },
          },
          {
            AND: [
              {
                cashPrice: {
                  lte: BigInt(minPrice),
                },
              },
              {
                transferPrice: {
                  gte: BigInt(maxPrice),
                },
              },
            ],
          },
          {
            AND: [
              {
                transferPrice: {
                  lte: BigInt(minPrice),
                },
              },
              {
                cashPrice: {
                  gte: BigInt(maxPrice),
                },
              },
            ],
          }
        );
      } else if (minPrice !== undefined) {
        priceConditions.push(
          {
            cashPrice: {
              gte: BigInt(minPrice),
            },
          },
          {
            transferPrice: {
              gte: BigInt(minPrice),
            },
          }
        );
      } else if (maxPrice !== undefined) {
        priceConditions.push(
          {
            cashPrice: {
              lte: BigInt(maxPrice),
            },
          },
          {
            transferPrice: {
              lte: BigInt(maxPrice),
            },
          }
        );
      }

      if (priceConditions.length > 0) {
        where.AND = [
          ...(where.AND ?? []),
          {
            OR: priceConditions,
          },
        ];
      }
    }

    // ==========================================
    // Sorting
    // ==========================================

    let orderBy: any = {
      id: "desc",
    };

    switch (sort) {
      case "price_asc":
        orderBy = {
          cashPrice: "asc",
        };
        break;

      case "price_desc":
        orderBy = {
          cashPrice: "desc",
        };
        break;

      case "newest":
        orderBy = {
          createdAt: "desc",
        };
        break;

      case "oldest":
        orderBy = {
          createdAt: "asc",
        };
        break;

      case "name_asc":
        orderBy = {
          name: "asc",
        };
        break;

      case "name_desc":
        orderBy = {
          name: "desc",
        };
        break;
    }

    // ==========================================
    // Total
    // ==========================================

    const total = await prisma.product.count({
      where,
    });

    // ==========================================
    // Products
    // ==========================================

    const products = await prisma.product.findMany({
      where,

      orderBy,

      skip: (page - 1) * limit,

      take: limit,

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
    // Response
    // ==========================================

    const data = products.map((product) => {
      return {
        id: product.id,

        slug: product.slug,

        name: product.name,

        code: product.code,

        image: product.image,

        description: product.description,

        fullDescription:
          product.fullDescription,

        cashPrice:
          product.cashPrice.toString(),

        transferPrice:
          product.transferPrice.toString(),

        manufacturer:
          product.manufacturer,

        productionYear:
          product.productionYear,

        isPopular:
          product.isPopular,

        isNew:
          product.isNew,

        // ======================================
        // Dynamic Filters
        // ======================================

        filters: product.filters.map(
          (productFilter) => ({
            key:
              productFilter.filterOption.filter.key,

            title:
              productFilter.filterOption.filter.title,

            type:
              productFilter.filterOption.filter.type,

            value:
              productFilter.filterOption.value,

            label:
              productFilter.filterOption.label,
          })
        ),

        // ======================================
        // Gallery
        // ======================================

        gallery:
          product.gallery.map(
            (image) => image.url
          ),

        // ======================================
        // Technical Check
        // ======================================

        technicalCheck:
          product.technicalCheck
            ? {
                purchaseValue:
                  product.technicalCheck
                    .purchaseValue,

                quality:
                  product.technicalCheck.quality,

                performance:
                  product.technicalCheck.performance,

                fuelConsumption:
                  product.technicalCheck
                    .fuelConsumption,

                strengths:
                  product.technicalCheck.items
                    .filter(
                      (item) =>
                        item.type === "strength"
                    )
                    .map(
                      (item) => item.text
                    ),

                weaknesses:
                  product.technicalCheck.items
                    .filter(
                      (item) =>
                        item.type === "weakness"
                    )
                    .map(
                      (item) => item.text
                    ),
              }
            : null,

        // ======================================
        // Technical Data
        // ======================================

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
                      label: item.label,
                      value: item.value,
                    })),

                performance:
                  product.technicalData.items
                    .filter(
                      (item) =>
                        item.type ===
                        "performance"
                    )
                    .map((item) => ({
                      label: item.label,
                      value: item.value,
                    })),
              }
            : null,
      };
    });

    // ==========================================
    // Pagination
    // ==========================================

    const totalPages =
      total === 0
        ? 0
        : Math.ceil(total / limit);

    return NextResponse.json({
      success: true,

      data,

      meta: {
        page,

        limit,

        total,

        totalPages,

        hasNextPage:
          page < totalPages,

        hasPreviousPage:
          page > 1 &&
          page <= totalPages,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/product error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "خطایی در دریافت خودروها رخ داده است.",

        error:
          process.env.NODE_ENV === "development"
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
    // Body
    // ==========================================

    const body = await request.json();

    const {
      slug,
      name,
      code,
      image,

      description,
      fullDescription,

      cashPrice,
      transferPrice,

      manufacturer,
      productionYear,

      isPopular,
      isNew,

      filterOptionIds,

      gallery,

      technicalCheck,
      technicalData,
    } = body;

    // ==========================================
    // Required fields
    // ==========================================

    if (
      !slug ||
      !name ||
      !code ||
      !image
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "فیلدهای الزامی محصول را کامل کنید.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Filter IDs validation
    // ==========================================

    if (
      filterOptionIds !== undefined &&
      !Array.isArray(filterOptionIds)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "filterOptionIds باید آرایه باشد.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Normalize Filter IDs
    // ==========================================

    const normalizedFilterOptionIds =
      Array.isArray(filterOptionIds)
        ? [
            ...new Set(
              filterOptionIds.map(
                (id) => Number(id)
              )
            ),
          ]
        : [];

    // ==========================================
    // Validate Filter IDs
    // ==========================================

    if (
      normalizedFilterOptionIds.some(
        (id) =>
          !Number.isInteger(id) ||
          id <= 0
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "شناسه فیلتر نامعتبر است.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Verify Filter Options
    // ==========================================

    if (
      normalizedFilterOptionIds.length >
      0
    ) {
      const filterOptions =
        await prisma.filterOption.findMany(
          {
            where: {
              id: {
                in: normalizedFilterOptionIds,
              },

              isActive: true,

              filter: {
                isActive: true,
              },
            },

            select: {
              id: true,
              filterId: true,
            },
          }
        );

      if (
        filterOptions.length !==
        normalizedFilterOptionIds.length
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "یک یا چند گزینه فیلتر معتبر نیست.",
          },
          { status: 400 }
        );
      }
    }

    // ==========================================
    // Price validation
    // ==========================================

    if (
      cashPrice === undefined ||
      cashPrice === null ||
      transferPrice === undefined ||
      transferPrice === null
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "قیمت نقدی و قیمت انتقال الزامی هستند.",
        },
        { status: 400 }
      );
    }

    const cashPriceNumber =
      Number(cashPrice);

    const transferPriceNumber =
      Number(transferPrice);

    if (
      !Number.isSafeInteger(
        cashPriceNumber
      ) ||
      cashPriceNumber < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "قیمت نقدی نامعتبر است.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isSafeInteger(
        transferPriceNumber
      ) ||
      transferPriceNumber < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "قیمت انتقال نامعتبر است.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Gallery validation
    // ==========================================

    if (
      gallery !== undefined &&
      !Array.isArray(gallery)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "فرمت گالری تصاویر نامعتبر است.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Technical Check validation
    // ==========================================

    if (
      technicalCheck !== undefined &&
      technicalCheck !== null &&
      typeof technicalCheck !==
        "object"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "فرمت بررسی فنی نامعتبر است.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Technical Data validation
    // ==========================================

    if (
      technicalData !== undefined &&
      technicalData !== null &&
      typeof technicalData !==
        "object"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "فرمت اطلاعات فنی نامعتبر است.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Technical Scores
    // ==========================================

    if (technicalCheck) {
      const scores = [
        technicalCheck.purchaseValue,
        technicalCheck.quality,
        technicalCheck.performance,
        technicalCheck.fuelConsumption,
      ];

      for (const score of scores) {
        if (
          score !== undefined &&
          score !== null &&
          (
            !Number.isInteger(
              Number(score)
            ) ||
            Number(score) < 0 ||
            Number(score) > 100
          )
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "امتیازهای بررسی فنی باید بین ۰ تا ۱۰۰ باشند.",
            },
            { status: 400 }
          );
        }
      }
    }

    // ==========================================
    // Create Product
    // ==========================================

    const product =
      await prisma.product.create({
        data: {
          // ====================================
          // Product
          // ====================================

          slug: String(slug).trim(),

          name: String(name).trim(),

          code: String(code).trim(),

          image: String(image).trim(),

          description:
            description !== undefined &&
            description !== null
              ? String(
                  description
                ).trim()
              : null,

          fullDescription:
            fullDescription !==
              undefined &&
            fullDescription !== null
              ? String(
                  fullDescription
                ).trim()
              : null,

          cashPrice:
            BigInt(cashPriceNumber),

          transferPrice:
            BigInt(
              transferPriceNumber
            ),

          manufacturer:
            manufacturer !==
              undefined &&
            manufacturer !== null
              ? String(
                  manufacturer
                ).trim()
              : null,

          productionYear:
            productionYear !==
              undefined &&
            productionYear !== null
              ? String(
                  productionYear
                ).trim()
              : null,

          isPopular:
            Boolean(isPopular),

          isNew:
            Boolean(isNew),

          // ====================================
          // Product Filters
          // ====================================

          filters:
            normalizedFilterOptionIds.length >
            0
              ? {
                  create:
                    normalizedFilterOptionIds.map(
                      (
                        filterOptionId
                      ) => ({
                        filterOption: {
                          connect: {
                            id: filterOptionId,
                          },
                        },
                      })
                    ),
                }
              : undefined,

          // ====================================
          // Gallery
          // ====================================

          gallery:
            Array.isArray(
              gallery
            ) &&
            gallery.length > 0
              ? {
                  create:
                    gallery.map(
                      (
                        item:
                          | string
                          | {
                              url: string;
                              sortOrder?: number;
                            },
                        index: number
                      ) => ({
                        url:
                          typeof item ===
                          "string"
                            ? item
                            : String(
                                item.url
                              ),

                        sortOrder:
                          typeof item ===
                          "string"
                            ? index
                            : item.sortOrder ??
                              index,
                      })
                    ),
                }
              : undefined,

          // ====================================
          // Technical Check
          // ====================================

          technicalCheck:
            technicalCheck
              ? {
                  create: {
                    purchaseValue:
                      Number(
                        technicalCheck.purchaseValue ??
                          0
                      ),

                    quality:
                      Number(
                        technicalCheck.quality ??
                          0
                      ),

                    performance:
                      Number(
                        technicalCheck.performance ??
                          0
                      ),

                    fuelConsumption:
                      Number(
                        technicalCheck.fuelConsumption ??
                          0
                      ),

                    items:
                      Array.isArray(
                        technicalCheck.items
                      )
                        ? {
                            create:
                              technicalCheck.items.map(
                                (item: {
                                  text: string;
                                  type: string;
                                }) => ({
                                  text: String(
                                    item.text
                                  ).trim(),

                                  type: String(
                                    item.type
                                  ).trim(),
                                })
                              ),
                          }
                        : undefined,
                  },
                }
              : undefined,

          // ====================================
          // Technical Data
          // ====================================

          technicalData:
            technicalData
              ? {
                  create: {
                    items:
                      Array.isArray(
                        technicalData.items
                      )
                        ? {
                            create:
                              technicalData.items.map(
                                (item: {
                                  label: string;
                                  value: string;
                                  type: string;
                                }) => ({
                                  label: String(
                                    item.label
                                  ).trim(),

                                  value: String(
                                    item.value
                                  ).trim(),

                                  type: String(
                                    item.type
                                  ).trim(),
                                })
                              ),
                          }
                        : undefined,
                  },
                }
              : undefined,
        },

        // ======================================
        // Include
        // ======================================

        include: {
          gallery: {
            orderBy: {
              sortOrder: "asc",
            },
          },

          filters: {
            include: {
              filterOption: {
                include: {
                  filter: true,
                },
              },
            },
          },

          technicalCheck: {
            include: {
              items: true,
            },
          },

          technicalData: {
            include: {
              items: true,
            },
          },
        },
      });

    // ==========================================
    // Response
    // ==========================================

    return NextResponse.json(
      {
        success: true,

        message:
          "محصول با موفقیت ایجاد شد.",

        data: {
          id: product.id,

          slug: product.slug,

          name: product.name,

          code: product.code,

          image: product.image,

          description:
            product.description,

          fullDescription:
            product.fullDescription,

          cashPrice:
            product.cashPrice.toString(),

          transferPrice:
            product.transferPrice.toString(),

          manufacturer:
            product.manufacturer,

          productionYear:
            product.productionYear,

          isPopular:
            product.isPopular,

          isNew:
            product.isNew,

          filters:
            product.filters.map(
              (item) => ({
                id:
                  item.filterOption.id,

                key:
                  item.filterOption
                    .filter.key,

                title:
                  item.filterOption
                    .filter.title,

                type:
                  item.filterOption
                    .filter.type,

                value:
                  item.filterOption
                    .value,

                label:
                  item.filterOption
                    .label,
              })
            ),

          gallery:
            product.gallery,

          technicalCheck:
            product.technicalCheck,

          technicalData:
            product.technicalData,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/product error:",
      error
    );

    // ==========================================
    // Prisma Unique Constraint
    // ==========================================

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Slug یا کد محصول قبلاً استفاده شده است.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,

        message:
          "خطایی در ایجاد محصول رخ داده است.",

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