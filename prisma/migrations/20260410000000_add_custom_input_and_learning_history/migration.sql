-- CreateTable
CREATE TABLE "CustomInput" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "algorithmId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomInput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "algorithmId" TEXT NOT NULL,
    "runCount" INTEGER NOT NULL DEFAULT 1,
    "lastRunAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LearningHistory_userId_algorithmId_key" ON "LearningHistory"("userId", "algorithmId");

-- AddForeignKey
ALTER TABLE "CustomInput" ADD CONSTRAINT "CustomInput_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningHistory" ADD CONSTRAINT "LearningHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
