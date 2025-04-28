/*
  Warnings:

  - Changed the type of `time` on the `Show` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ShowTime" AS ENUM ('SIX_PM', 'SEVEN_THIRTY', 'NINE_PM');

-- AlterTable
ALTER TABLE "Show" DROP COLUMN "time",
ADD COLUMN     "time" "ShowTime" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Show_date_time_key" ON "Show"("date", "time");
