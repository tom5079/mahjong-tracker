/*
  Warnings:

  - You are about to drop the column `members` on the `Parlor` table. All the data in the column will be lost.
  - You are about to drop the column `moderators` on the `Parlor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Parlor" DROP COLUMN "members",
DROP COLUMN "moderators";
