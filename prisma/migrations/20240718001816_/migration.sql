/*
  Warnings:

  - Added the required column `parlorId` to the `Ruleset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ruleset" ADD COLUMN     "parlorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Ruleset" ADD CONSTRAINT "Ruleset_parlorId_fkey" FOREIGN KEY ("parlorId") REFERENCES "Parlor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
