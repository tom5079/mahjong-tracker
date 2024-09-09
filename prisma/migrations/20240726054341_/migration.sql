/*
  Warnings:

  - You are about to drop the `EventJoinRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventJoinRequest" DROP CONSTRAINT "EventJoinRequest_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventJoinRequest" DROP CONSTRAINT "EventJoinRequest_userId_fkey";

-- DropTable
DROP TABLE "EventJoinRequest";

-- CreateTable
CREATE TABLE "EventAttendee" (
    "userId" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "status" "EventJoinRequestStatus" NOT NULL,

    CONSTRAINT "EventAttendee_pkey" PRIMARY KEY ("userId","eventId")
);

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
