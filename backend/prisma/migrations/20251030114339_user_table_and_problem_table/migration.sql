-- CreateEnum
CREATE TYPE "StatusRole" AS ENUM ('COMPLETED', 'NOTCOMPLETED');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('HARD', 'MEDIUM', 'EASY');

-- CreateTable
CREATE TABLE "Problem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficultyLevel" "Difficulty" NOT NULL,
    "tags" TEXT[],
    "userId" TEXT NOT NULL,
    "examples" JSONB NOT NULL,
    "hints" TEXT,
    "constraints" TEXT NOT NULL,
    "editorial" TEXT,
    "testcases" JSONB NOT NULL,
    "questionImage" TEXT,
    "codenippets" JSONB NOT NULL,
    "referenceSolutions" JSONB NOT NULL,
    "answerImage" TEXT,
    "status" "StatusRole" NOT NULL DEFAULT 'NOTCOMPLETED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
