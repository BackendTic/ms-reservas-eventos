/*
  Warnings:

  - Added the required column `fechaFin` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "fechaFin" TIMESTAMP(3) NOT NULL;
