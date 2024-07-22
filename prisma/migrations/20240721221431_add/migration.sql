/*
  Warnings:

  - Added the required column `horaFin` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "esEvento" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "horaFin" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TimeSlot" ADD COLUMN     "esEvento" BOOLEAN NOT NULL DEFAULT false;
