/*
  Warnings:

  - Added the required column `estado` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('Activa', 'Cancelada');

-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "estado" "EstadoReserva" NOT NULL;
