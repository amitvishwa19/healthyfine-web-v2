/*
  Warnings:

  - You are about to drop the column `emergencyContact` on the `MedicalProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MedicalProfile" DROP COLUMN "emergencyContact";

-- AlterTable
ALTER TABLE "Server" ADD COLUMN     "policy" JSONB;
