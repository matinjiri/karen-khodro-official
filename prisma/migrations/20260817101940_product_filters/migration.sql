/*
  Warnings:

  - You are about to drop the column `bodyType` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `fuel` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `usage` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "bodyType",
DROP COLUMN "brand",
DROP COLUMN "color",
DROP COLUMN "country",
DROP COLUMN "fuel",
DROP COLUMN "status",
DROP COLUMN "usage";

-- CreateTable
CREATE TABLE "ProductFilter" (
    "productId" INTEGER NOT NULL,
    "filterOptionId" INTEGER NOT NULL,

    CONSTRAINT "ProductFilter_pkey" PRIMARY KEY ("productId","filterOptionId")
);

-- CreateIndex
CREATE INDEX "ProductFilter_filterOptionId_idx" ON "ProductFilter"("filterOptionId");

-- AddForeignKey
ALTER TABLE "ProductFilter" ADD CONSTRAINT "ProductFilter_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFilter" ADD CONSTRAINT "ProductFilter_filterOptionId_fkey" FOREIGN KEY ("filterOptionId") REFERENCES "FilterOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
