/*
  Warnings:

  - The values [otro] on the enum `IncomeType` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `category` on the `Expense` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('publicidad', 'bar', 'sueldos', 'artistas', 'alquiler', 'servicios', 'insumos', 'mantenimiento', 'comisiones', 'varios');

-- AlterEnum
BEGIN;
CREATE TYPE "IncomeType_new" AS ENUM ('tickets', 'tickets_web', 'barra', 'otros');
ALTER TABLE "Income" ALTER COLUMN "type" TYPE "IncomeType_new" USING ("type"::text::"IncomeType_new");
ALTER TYPE "IncomeType" RENAME TO "IncomeType_old";
ALTER TYPE "IncomeType_new" RENAME TO "IncomeType";
DROP TYPE "IncomeType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "category",
ADD COLUMN     "category" "ExpenseCategory" NOT NULL;
