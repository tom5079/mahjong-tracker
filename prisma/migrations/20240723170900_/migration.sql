/*
  Warnings:

  - You are about to drop the column `type` on the `Ruleset` table. All the data in the column will be lost.
  - Added the required column `length` to the `Ruleset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player` to the `Ruleset` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Players" AS ENUM ('FOUR', 'THREE');

-- CreateEnum
CREATE TYPE "GameLength" AS ENUM ('HANCHAN', 'TONPU');

-- AlterTable
ALTER TABLE "Ruleset" DROP COLUMN "type",
ADD COLUMN     "length" "GameLength" NOT NULL,
ADD COLUMN     "player" "Players" NOT NULL;

-- DropEnum
DROP TYPE "GameType";
