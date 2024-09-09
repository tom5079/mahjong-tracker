/*
  Warnings:

  - Added the required column `multiRonHonbaPolicy` to the `Ruleset` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `multiRonPotPolicy` on the `Ruleset` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MultiRonPotPolicy" AS ENUM ('ATAMAHANE', 'SPLIT');

-- CreateEnum
CREATE TYPE "MultiRonHonbaPolicy" AS ENUM ('ATAMAHANE', 'SPLIT', 'ALL');

-- AlterTable
ALTER TABLE "Ruleset" ADD COLUMN     "multiRonHonbaPolicy" "MultiRonHonbaPolicy" NOT NULL,
DROP COLUMN "multiRonPotPolicy",
ADD COLUMN     "multiRonPotPolicy" "MultiRonPotPolicy" NOT NULL;

-- DropEnum
DROP TYPE "MultironPotPolicy";
