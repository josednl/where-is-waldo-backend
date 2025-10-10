/*
  Warnings:

  - You are about to drop the column `timeMs` on the `LeaderboardEntry` table. All the data in the column will be lost.
  - Added the required column `time` to the `LeaderboardEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeaderboardEntry" RENAME COLUMN "timeMs" TO "time";
