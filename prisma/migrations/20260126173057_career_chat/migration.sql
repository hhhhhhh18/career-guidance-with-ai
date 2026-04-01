-- CreateTable
CREATE TABLE "CareerChat" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareerChat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CareerChat_userId_idx" ON "CareerChat"("userId");
