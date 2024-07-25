/*
  Warnings:

  - Added the required column `emailEncargado` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombreEncargado` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "emailEncargado" TEXT NOT NULL,
ADD COLUMN     "nombreEncargado" TEXT NOT NULL;
