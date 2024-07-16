-- CreateTable
CREATE TABLE "Parlor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "website" TEXT,
    "moderators" TEXT[],
    "members" TEXT[],
    "note" TEXT NOT NULL,

    CONSTRAINT "Parlor_pkey" PRIMARY KEY ("id")
);
