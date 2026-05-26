-- CreateEnum
CREATE TYPE "Category" AS ENUM ('smartphones', 'laptops', 'monitors', 'headphones', 'cameras', 'consoles', 'watches', 'accessories');

-- CreateEnum
CREATE TYPE "Badge" AS ENUM ('new', 'hit', 'sale');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "price" INTEGER NOT NULL,
    "oldPrice" INTEGER,
    "emoji" TEXT NOT NULL DEFAULT '📦',
    "badge" "Badge",
    "specs" TEXT[],
    "description" TEXT NOT NULL,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "colors" TEXT[],
    "rating" INTEGER NOT NULL DEFAULT 5,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "isStatic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
