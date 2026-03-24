/*
  Warnings:

  - Added the required column `passed` to the `TestcaseResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testCased` to the `TestcaseResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TestcaseResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TestcaseResult" ADD COLUMN     "compileOutput" TEXT,
ADD COLUMN     "memory" TEXT,
ADD COLUMN     "passed" BOOLEAN NOT NULL,
ADD COLUMN     "stderr" TEXT,
ADD COLUMN     "testCased" INTEGER NOT NULL,
ADD COLUMN     "time" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "problemSolved" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "problemSolved_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "problemSolved_userId_problemId_key" ON "problemSolved"("userId", "problemId");

-- CreateIndex
CREATE INDEX "TestcaseResult_submissionId_idx" ON "TestcaseResult"("submissionId");

-- AddForeignKey
ALTER TABLE "problemSolved" ADD CONSTRAINT "problemSolved_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problemSolved" ADD CONSTRAINT "problemSolved_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
