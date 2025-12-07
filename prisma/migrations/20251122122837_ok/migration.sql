/*
  Warnings:

  - You are about to drop the column `userId` on the `Setting` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Setting" DROP CONSTRAINT "Setting_userId_fkey";

-- AlterTable
ALTER TABLE "Setting" DROP COLUMN "userId";
