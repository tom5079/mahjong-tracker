/*
  Warnings:

  - The primary key for the `EventJoinRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user` on the `EventJoinRequest` table. All the data in the column will be lost.
  - Added the required column `userId` to the `EventJoinRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventJoinRequest" DROP CONSTRAINT "EventJoinRequest_pkey",
DROP COLUMN "user",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "EventJoinRequest_pkey" PRIMARY KEY ("userId", "eventId");

-- AddForeignKey
ALTER TABLE "EventJoinRequest" ADD CONSTRAINT "EventJoinRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
