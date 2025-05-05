-- AlterTable
ALTER TABLE "CashClosure" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "CashClosure" ADD CONSTRAINT "CashClosure_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
