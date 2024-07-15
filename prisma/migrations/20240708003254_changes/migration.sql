/*
  Warnings:

  - The primary key for the `TimeSlot` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `TimeSlot` table. All the data in the column will be lost.
  - The required column `id` was added to the `TimeSlot` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `reservaId` to the `TimeSlot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TimeSlot" DROP CONSTRAINT "TimeSlot_Id_fkey";

-- AlterTable
ALTER TABLE "TimeSlot" DROP CONSTRAINT "TimeSlot_pkey",
DROP COLUMN "Id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "reservaId" TEXT NOT NULL,
ADD CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "TimeSlot" ADD CONSTRAINT "TimeSlot_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
