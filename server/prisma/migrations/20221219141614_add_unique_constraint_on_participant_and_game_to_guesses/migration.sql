/*
  Warnings:

  - A unique constraint covering the columns `[participantId,gameId]` on the table `guesses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "guesses_participantId_gameId_key" ON "guesses"("participantId", "gameId");
