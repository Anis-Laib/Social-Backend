/*
  Warnings:

  - The primary key for the `Like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Like` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Like" DROP CONSTRAINT "Like_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "updatedAt",
ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("postId", "userId");
