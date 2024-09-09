/*
  Warnings:

  - You are about to drop the column `rank` on the `GamePlayers` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `GamePlayers` table. All the data in the column will be lost.
  - Added the required column `index` to the `GamePlayers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GamePlayers" DROP COLUMN "rank",
DROP COLUMN "score",
ADD COLUMN     "index" INTEGER NOT NULL;
