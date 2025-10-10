/*
  Warnings:

  - A unique constraint covering the columns `[gameId,playerName]` on the table `LeaderboardEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."LeaderboardEntry_playerName_key";

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_gameId_playerName_key" ON "LeaderboardEntry"("gameId", "playerName");
