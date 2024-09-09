/*
  Warnings:

  - Added the required column `requestPolicy` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventJoinRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "requestPolicy" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "EventJoinRequest" (
    "user" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "status" "EventJoinRequestStatus" NOT NULL,

    CONSTRAINT "EventJoinRequest_pkey" PRIMARY KEY ("user","eventId")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "users" TEXT[],
    "actions" JSONB NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventJoinRequest" ADD CONSTRAINT "EventJoinRequest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
