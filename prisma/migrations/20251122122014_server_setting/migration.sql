/*
  Warnings:

  - You are about to drop the column `description` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the `Serversetting` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[serverId]` on the table `Setting` will be added. If there are existing duplicate values, this will fail.
  - Made the column `serverId` on table `Setting` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Serversetting" DROP CONSTRAINT "Serversetting_serverId_fkey";

-- AlterTable
ALTER TABLE "Setting" DROP COLUMN "description",
DROP COLUMN "key",
DROP COLUMN "value",
ADD COLUMN     "consultationOptions" JSONB,
ADD COLUMN     "offline" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "online" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slotTime" INTEGER,
ADD COLUMN     "timing" JSONB,
ADD COLUMN     "type" TEXT,
ALTER COLUMN "serverId" SET NOT NULL;

-- DropTable
DROP TABLE "Serversetting";

-- CreateIndex
CREATE UNIQUE INDEX "Setting_serverId_key" ON "Setting"("serverId");

-- CreateIndex
CREATE INDEX "Setting_serverId_idx" ON "Setting"("serverId");
