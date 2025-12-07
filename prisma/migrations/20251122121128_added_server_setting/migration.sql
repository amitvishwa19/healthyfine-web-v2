-- CreateTable
CREATE TABLE "Serversetting" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "type" TEXT,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "offline" BOOLEAN NOT NULL DEFAULT false,
    "timing" JSONB,
    "slotTime" INTEGER,
    "consultationOptions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Serversetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Serversetting_serverId_key" ON "Serversetting"("serverId");

-- CreateIndex
CREATE INDEX "Serversetting_serverId_idx" ON "Serversetting"("serverId");

-- AddForeignKey
ALTER TABLE "Serversetting" ADD CONSTRAINT "Serversetting_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;
