-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('efectivo', 'tarjeta', 'bizum', 'transferencia', 'otro');

-- AlterTable
ALTER TABLE "Income" ADD COLUMN     "paymentMethod" "PaymentMethod";
