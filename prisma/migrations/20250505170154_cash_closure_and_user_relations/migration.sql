-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "cashClosureId" INTEGER,
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Income" ADD COLUMN     "cashClosureId" INTEGER,
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "ReservationItem" ADD COLUMN     "cashClosureId" INTEGER;

-- AlterTable
ALTER TABLE "Show" ADD COLUMN     "cashClosureId" INTEGER;

-- CreateTable
CREATE TABLE "CashClosure" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "ticketsSoldAmount" DOUBLE PRECISION NOT NULL,
    "ticketsSoldWeb" INTEGER NOT NULL,
    "ticketsSold" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CashClosure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CashClosure_date_key" ON "CashClosure"("date");

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_cashClosureId_fkey" FOREIGN KEY ("cashClosureId") REFERENCES "CashClosure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationItem" ADD CONSTRAINT "ReservationItem_cashClosureId_fkey" FOREIGN KEY ("cashClosureId") REFERENCES "CashClosure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_cashClosureId_fkey" FOREIGN KEY ("cashClosureId") REFERENCES "CashClosure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_cashClosureId_fkey" FOREIGN KEY ("cashClosureId") REFERENCES "CashClosure"("id") ON DELETE SET NULL ON UPDATE CASCADE;
