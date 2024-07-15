/*
  Warnings:

  - You are about to drop the column `fechaFin` on the `Reserva` table. All the data in the column will be lost.
  - You are about to drop the column `horaFin` on the `Reserva` table. All the data in the column will be lost.
  - You are about to drop the column `horaFin` on the `TimeSlot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reserva" DROP COLUMN "fechaFin",
DROP COLUMN "horaFin";

-- AlterTable
ALTER TABLE "TimeSlot" DROP COLUMN "horaFin";
