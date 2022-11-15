/*
  Warnings:

  - You are about to drop the column `creditedAccount` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `debitedAccount` on the `Transactions` table. All the data in the column will be lost.
  - Added the required column `creditedAccountId` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `debitedAccountId` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "creditedAccount",
DROP COLUMN "debitedAccount",
ADD COLUMN     "creditedAccountId" TEXT NOT NULL,
ADD COLUMN     "debitedAccountId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_debitedAccountId_fkey" FOREIGN KEY ("debitedAccountId") REFERENCES "Accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_creditedAccountId_fkey" FOREIGN KEY ("creditedAccountId") REFERENCES "Accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
