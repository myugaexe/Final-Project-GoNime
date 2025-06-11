/*
  Warnings:

  - A unique constraint covering the columns `[animeId]` on the table `AnimeList` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[animeId,userId]` on the table `AnimeList` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AnimeList_animeId_key" ON "AnimeList"("animeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeList_animeId_userId_key" ON "AnimeList"("animeId", "userId");
