-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AppSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "whatsappNumber" TEXT NOT NULL,
    "currencyLabel" TEXT NOT NULL,
    "conversionRate" REAL NOT NULL DEFAULT 0.1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AppSettings" ("createdAt", "currencyLabel", "id", "updatedAt", "whatsappNumber") SELECT "createdAt", "currencyLabel", "id", "updatedAt", "whatsappNumber" FROM "AppSettings";
DROP TABLE "AppSettings";
ALTER TABLE "new_AppSettings" RENAME TO "AppSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
