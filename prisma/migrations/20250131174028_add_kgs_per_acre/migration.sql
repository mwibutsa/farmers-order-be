/*
  Warnings:

  - Added the required column `kgPerAcre` to the `Fertilizer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kgPerAcre` to the `Seed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fertilizer" ADD COLUMN     "kgPerAcre" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Seed" ADD COLUMN     "kgPerAcre" DOUBLE PRECISION NOT NULL;
