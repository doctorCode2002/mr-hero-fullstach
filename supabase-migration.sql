-- ============================================
-- Supabase Migration Script
-- Pricing Model Refactor & Schema Update
-- ============================================

-- 1. Add product_id column to Product table
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "product_id" TEXT;

-- 2. Populate product_id with existing IDs (if null)
UPDATE "Product" SET "product_id" = "id" WHERE "product_id" IS NULL;

-- 3. Make product_id NOT NULL and UNIQUE
ALTER TABLE "Product" ALTER COLUMN "product_id" SET NOT NULL;
ALTER TABLE "Product" ADD CONSTRAINT "Product_product_id_key" UNIQUE ("product_id");

-- 4. Clean up Product Table columns
-- Remove columns no longer needed
ALTER TABLE "Product" DROP COLUMN IF EXISTS "deliveryCostPerItemILS";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "conversionRate";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "nameEn";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "descriptionEn";

-- Rename Arabic columns to standard names
ALTER TABLE "Product" RENAME COLUMN "nameAr" TO "name";
ALTER TABLE "Product" RENAME COLUMN "descriptionAr" TO "description";
ALTER TABLE "Product" RENAME COLUMN "sellingPricePerItemILS" TO "sellingPricePerItemUSD";

-- 5. Clean up Category Table columns
ALTER TABLE "Category" DROP COLUMN IF EXISTS "nameEn";
ALTER TABLE "Category" RENAME COLUMN "nameAr" TO "name";

-- 6. Update AppSettings Table
ALTER TABLE "AppSettings" ADD COLUMN IF NOT EXISTS "deliveryCostPerPalletUSD" DOUBLE PRECISION DEFAULT 2200;
ALTER TABLE "AppSettings" ADD COLUMN IF NOT EXISTS "halfPalletDeliveryCostUSD" DOUBLE PRECISION DEFAULT 1200;

-- 7. Initialize Settings Values
UPDATE "AppSettings" SET 
  "deliveryCostPerPalletUSD" = 2200,
  "halfPalletDeliveryCostUSD" = 1200
WHERE "id" = 1;

-- ============================================
-- Migration Complete
-- ============================================
