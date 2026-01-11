-- Clear all data from tables
TRUNCATE TABLE "Product" CASCADE;
TRUNCATE TABLE "Category" CASCADE;
TRUNCATE TABLE "AppSettings" CASCADE;

-- Optional: Reset settings to default
INSERT INTO "AppSettings" ("id", "whatsappNumber", "currencyLabel", "conversionRate")
VALUES ('global', '972501234567', 'ILS', 13.5);
