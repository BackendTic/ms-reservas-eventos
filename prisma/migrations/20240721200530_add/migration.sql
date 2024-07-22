/*
  Warnings:

  - Added the required column `nombreReserva` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombreReserva` to the `TimeSlot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "nombreReserva" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TimeSlot" ADD COLUMN     "nombreReserva" TEXT NOT NULL;
