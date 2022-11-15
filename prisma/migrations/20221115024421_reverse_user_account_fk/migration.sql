/*
  Warnings:

  - You are about to drop the column `userId` on the `Accounts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accountId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountId` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Accounts" DROP CONSTRAINT "Accounts_userId_fkey";

-- DropIndex
DROP INDEX "Accounts_userId_key";

-- AlterTable
ALTER TABLE "Accounts" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "accountId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_accountId_key" ON "Users"("accountId");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
