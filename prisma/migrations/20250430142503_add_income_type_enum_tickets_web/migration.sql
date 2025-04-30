/*
  Warnings:

  - The values [ticket] on the enum `IncomeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "IncomeType_new" AS ENUM ('tickets', 'tickets_web', 'barra', 'otro');
ALTER TABLE "Income" ALTER COLUMN "type" TYPE "IncomeType_new" USING ("type"::text::"IncomeType_new");
ALTER TYPE "IncomeType" RENAME TO "IncomeType_old";
ALTER TYPE "IncomeType_new" RENAME TO "IncomeType";
DROP TYPE "IncomeType_old";
COMMIT;
