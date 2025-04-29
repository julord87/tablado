/*
  Warnings:

  - A unique constraint covering the columns `[reservationCode]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reservationCode` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "reservationCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_reservationCode_key" ON "Reservation"("reservationCode");
