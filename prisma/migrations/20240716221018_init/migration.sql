-- CreateTable
CREATE TABLE "UserToken" (
    "sessionId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserToken_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parlor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "website" TEXT,
    "note" TEXT NOT NULL,

    CONSTRAINT "Parlor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParlorMember" (
    "id" SERIAL NOT NULL,
    "parlorId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ParlorMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParlorMember" ADD CONSTRAINT "ParlorMember_parlorId_fkey" FOREIGN KEY ("parlorId") REFERENCES "Parlor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
