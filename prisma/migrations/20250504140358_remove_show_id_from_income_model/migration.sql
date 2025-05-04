/*
  Warnings:

  - You are about to drop the column `showId` on the `Income` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Income" DROP CONSTRAINT "Income_showId_fkey";

-- AlterTable
ALTER TABLE "Income" DROP COLUMN "showId";
