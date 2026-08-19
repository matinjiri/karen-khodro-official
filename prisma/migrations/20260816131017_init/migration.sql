-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT,
    "fullDescription" TEXT,
    "cashPrice" BIGINT NOT NULL,
    "transferPrice" BIGINT NOT NULL,
    "usage" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "bodyType" TEXT NOT NULL,
    "country" TEXT,
    "manufacturer" TEXT,
    "productionYear" TEXT,
    "color" TEXT,
    "fuel" TEXT,
    "status" TEXT NOT NULL DEFAULT 'موجود',
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalCheck" (
    "id" SERIAL NOT NULL,
    "purchaseValue" INTEGER NOT NULL,
    "quality" INTEGER NOT NULL,
    "performance" INTEGER NOT NULL,
    "fuelConsumption" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "TechnicalCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalCheckItem" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "checkId" INTEGER NOT NULL,

    CONSTRAINT "TechnicalCheckItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalData" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "TechnicalData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalDataItem" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "technicalDataId" INTEGER NOT NULL,

    CONSTRAINT "TechnicalDataItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_code_key" ON "Product"("code");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalCheck_productId_key" ON "TechnicalCheck"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalData_productId_key" ON "TechnicalData"("productId");

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalCheck" ADD CONSTRAINT "TechnicalCheck_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalCheckItem" ADD CONSTRAINT "TechnicalCheckItem_checkId_fkey" FOREIGN KEY ("checkId") REFERENCES "TechnicalCheck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalData" ADD CONSTRAINT "TechnicalData_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalDataItem" ADD CONSTRAINT "TechnicalDataItem_technicalDataId_fkey" FOREIGN KEY ("technicalDataId") REFERENCES "TechnicalData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
