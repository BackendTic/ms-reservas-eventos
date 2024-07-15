/*
  Warnings:

  - The primary key for the `TimeSlot` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `timeId` on the `TimeSlot` table. All the data in the column will be lost.
  - The required column `Id` was added to the `TimeSlot` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "TimeSlot" DROP CONSTRAINT "TimeSlot_timeId_fkey";

-- AlterTable
ALTER TABLE "TimeSlot" DROP CONSTRAINT "TimeSlot_pkey",
DROP COLUMN "timeId",
ADD COLUMN     "Id" TEXT NOT NULL,
ADD CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("Id");

-- AddForeignKey
ALTER TABLE "TimeSlot" ADD CONSTRAINT "TimeSlot_Id_fkey" FOREIGN KEY ("Id") REFERENCES "Reserva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
