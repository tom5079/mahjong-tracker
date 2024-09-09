/*
  Warnings:

  - You are about to drop the column `chonboAffectsScore` on the `Ruleset` table. All the data in the column will be lost.
  - Changed the type of `chonbo` on the `Ruleset` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Ruleset" DROP COLUMN "chonboAffectsScore",
DROP COLUMN "chonbo",
ADD COLUMN     "chonbo" JSONB NOT NULL;
