-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "firstname" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "lastname" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "phone" TEXT;
