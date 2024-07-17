/*
  Warnings:

  - Added the required column `espacio` to the `TimeSlot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TimeSlot" ADD COLUMN     "espacio" TEXT NOT NULL;
