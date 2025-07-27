-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('FLAMENCO', 'TANGO', 'MILONGA', 'POP', 'CANTAUTOR', 'FOLCLORE', 'OTRO');

-- AlterTable
ALTER TABLE "Show" ADD COLUMN     "description" TEXT,
ADD COLUMN     "genre" "Genre",
ADD COLUMN     "title" TEXT NOT NULL DEFAULT '';
