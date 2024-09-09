/*
  Warnings:

  - Changed the type of `table` on the `Game` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "table",
ADD COLUMN     "table" INTEGER NOT NULL;
