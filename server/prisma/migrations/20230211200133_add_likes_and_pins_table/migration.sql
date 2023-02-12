-- CreateTable
CREATE TABLE "Pin" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(80) NOT NULL,
    "image" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PinUserLikes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "pinId" INTEGER NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PinUserLikes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PinUserLikes_userId_key" ON "PinUserLikes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PinUserLikes_pinId_key" ON "PinUserLikes"("pinId");

-- AddForeignKey
ALTER TABLE "Pin" ADD CONSTRAINT "Pin_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinUserLikes" ADD CONSTRAINT "PinUserLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinUserLikes" ADD CONSTRAINT "PinUserLikes_pinId_fkey" FOREIGN KEY ("pinId") REFERENCES "Pin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
