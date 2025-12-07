/*
  Warnings:

  - You are about to drop the column `policy` on the `Server` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Server" DROP COLUMN "policy",
ADD COLUMN     "privacy" TEXT,
ADD COLUMN     "terms" TEXT;
