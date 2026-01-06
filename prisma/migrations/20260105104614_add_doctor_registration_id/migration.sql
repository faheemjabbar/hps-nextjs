/*
  Warnings:

  - A unique constraint covering the columns `[registrationId]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrationId` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Receptionist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "registrationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Receptionist" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_registrationId_key" ON "Doctor"("registrationId");
