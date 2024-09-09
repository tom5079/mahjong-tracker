/*
  Warnings:

  - Added the required column `rulesetId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('THREE_PLAYER_EAST', 'THREE_PLAYER_HANCHAN', 'FOUR_PLAYER_EAST', 'FOUR_PLAYER_HANCHAN');

-- CreateEnum
CREATE TYPE "TiebreakerPolicy" AS ENUM ('SPLIT', 'WIND');

-- CreateEnum
CREATE TYPE "EndgamePolicy" AS ENUM ('DISAPPEARS', 'TOP', 'DEALER');

-- CreateEnum
CREATE TYPE "RenchanPolicy" AS ENUM ('NONE', 'TENPAI', 'AGARI');

-- CreateEnum
CREATE TYPE "AllLastPolicy" AS ENUM ('AGARIYAME_FIRST', 'AGARIYAME_SECOND', 'AGARIYAME_THIRD', 'AGARIYAME_ANY', 'TENPAIYAME_FIRST', 'TENPAIYAME_SECOND', 'TENPAIYAME_THIRD', 'TENPAIYAME_ANY', 'NONE');

-- CreateEnum
CREATE TYPE "MultironPotPolicy" AS ENUM ('ATAMAHANE', 'SPLIT');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "rulesetId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Ruleset" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "GameType" NOT NULL,
    "startScore" INTEGER NOT NULL,
    "returnScore" INTEGER NOT NULL,
    "uma" JSONB NOT NULL,
    "honba" INTEGER NOT NULL,
    "tenpaiFee" INTEGER NOT NULL,
    "endgamePot" "EndgamePolicy" NOT NULL,
    "tiebreaker" "TiebreakerPolicy" NOT NULL,
    "renchan" "RenchanPolicy" NOT NULL,
    "allLast" "AllLastPolicy" NOT NULL,
    "doubleRon" BOOLEAN NOT NULL,
    "tripleRon" BOOLEAN NOT NULL,
    "multiRonPotPolicy" "MultironPotPolicy" NOT NULL,
    "nagashi" TEXT NOT NULL,
    "nagashiIsTsumo" BOOLEAN NOT NULL,
    "chonbo" TEXT NOT NULL,
    "chonboAffectsScore" BOOLEAN NOT NULL,
    "oyaNagashi" BOOLEAN NOT NULL,
    "suddenDeath" INTEGER,
    "tobi" BOOLEAN NOT NULL,
    "tobiAtZero" BOOLEAN NOT NULL,
    "calledGame" INTEGER,
    "riichiBelow1000" BOOLEAN NOT NULL,
    "scores" JSONB NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "Ruleset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "Ruleset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
