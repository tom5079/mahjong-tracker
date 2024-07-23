/*
  Warnings:

  - Added the required column `record` to the `Ruleset` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Record" AS ENUM ('GAME', 'HAND');

-- AlterTable
ALTER TABLE "Ruleset" ADD COLUMN     "record" "Record" NOT NULL;
