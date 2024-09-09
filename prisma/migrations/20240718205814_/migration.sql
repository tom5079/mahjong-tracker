/*
  Warnings:

  - The values [AGARIYAME_FIRST,AGARIYAME_SECOND,AGARIYAME_THIRD,AGARIYAME_ANY,TENPAIYAME_FIRST,TENPAIYAME_SECOND,TENPAIYAME_THIRD,TENPAIYAME_ANY] on the enum `AllLastPolicy` will be removed. If these variants are still used in the database, this will fail.
  - The values [DEALER] on the enum `EndgamePolicy` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AllLastPolicy_new" AS ENUM ('AGARIYAME', 'TENPAIYAME', 'NONE');
ALTER TABLE "Ruleset" ALTER COLUMN "allLast" TYPE "AllLastPolicy_new" USING ("allLast"::text::"AllLastPolicy_new");
ALTER TYPE "AllLastPolicy" RENAME TO "AllLastPolicy_old";
ALTER TYPE "AllLastPolicy_new" RENAME TO "AllLastPolicy";
DROP TYPE "AllLastPolicy_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EndgamePolicy_new" AS ENUM ('DISAPPEARS', 'TOP');
ALTER TABLE "Ruleset" ALTER COLUMN "endgamePot" TYPE "EndgamePolicy_new" USING ("endgamePot"::text::"EndgamePolicy_new");
ALTER TYPE "EndgamePolicy" RENAME TO "EndgamePolicy_old";
ALTER TYPE "EndgamePolicy_new" RENAME TO "EndgamePolicy";
DROP TYPE "EndgamePolicy_old";
COMMIT;

-- AlterEnum
ALTER TYPE "RenchanPolicy" ADD VALUE 'ALWAYS';

-- AlterTable
ALTER TABLE "Ruleset" ADD COLUMN     "allLastPlacement" INTEGER;
