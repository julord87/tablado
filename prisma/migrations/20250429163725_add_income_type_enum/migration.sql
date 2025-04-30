-- CreateEnum
CREATE TYPE "IncomeType" AS ENUM ('ticket', 'barra', 'otro');

-- AlterTable
ALTER TABLE "Income" ADD COLUMN     "type" "IncomeType";
