-- CreateEnum
CREATE TYPE "public"."MoodType" AS ENUM ('DAILY_CHECKIN', 'POST_WORKOUT', 'POST_MEDITATION');

-- CreateEnum
CREATE TYPE "public"."MoodValue" AS ENUM ('HAPPY', 'CONTENT', 'NEUTRAL', 'STRESSED', 'SAD', 'ANGRY');

-- CreateTable
CREATE TABLE "public"."MoodEntry" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "public"."MoodType" NOT NULL,
    "mood" "public"."MoodValue" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoodEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."MoodEntry" ADD CONSTRAINT "MoodEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
