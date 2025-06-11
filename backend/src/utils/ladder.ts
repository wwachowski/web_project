import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function generateBracket(tournamentId: number) {
  const tournament = await prisma.tournaments.findUnique({
    where: { id: tournamentId },
    include: { tournament_participants: true },
  });

  if (!tournament) throw new Error("Tournament not found");
  if (new Date() < tournament.start_time) throw new Error("Tournament has not started yet");

  const participants = tournament.tournament_participants;

  if (participants.length < 2) throw new Error("Not enough participants to generate bracket");

  // Sort by ranking ASC (lower = better)
  const sortedParticipants = [...participants].sort((a, b) => a.ranking - b.ranking);

  const matchesToCreate = [];
  let currentPlayers = sortedParticipants.map((p) => p.id);
  let round = 1;

  while (currentPlayers.length > 1) {
    const roundMatches: { player1_id: number | null; player2_id: number | null; round: number }[] = [];
    const playersForThisRound = [...currentPlayers];
    currentPlayers = [];

    // Handle odd number of players — assign farciarz
    let farciarz: number | null = null;
    if (playersForThisRound.length % 2 !== 0) {
      farciarz = playersForThisRound.pop()!; // Lowest ranking = last one, because sorted ascending
      currentPlayers.push(farciarz);
    }

    // Shuffle players for randomness (round 1 only)
    if (round === 1) {
      for (let i = playersForThisRound.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playersForThisRound[i], playersForThisRound[j]] = [playersForThisRound[j], playersForThisRound[i]];
      }
    }

    // Generate matches for this round
    for (let i = 0; i < playersForThisRound.length; i += 2) {
      const player1 = playersForThisRound[i];
      const player2 = playersForThisRound[i + 1];
      roundMatches.push({ player1_id: player1, player2_id: player2, round });
    }

    // Add empty slots for future rounds, players will be filled based on winners
    const numberOfWinners = roundMatches.length + (farciarz ? 1 : 0);
    currentPlayers.length = 0;
    for (let i = 0; i < Math.floor(numberOfWinners / 2); i++) {
      roundMatches.push({ player1_id: null, player2_id: null, round: round + 1 });
      currentPlayers.push(null as unknown as number); // placeholders
    }
    if (numberOfWinners % 2 !== 0) {
      currentPlayers.push(null as unknown as number); // placeholder for farciarz in next round
    }

    matchesToCreate.push(...roundMatches);
    round++;
  }

  // Save all matches in bulk
  await prisma.matches.createMany({
    data: matchesToCreate.map((m) => ({
      tournament_id: tournamentId,
      player1_id: m.player1_id,
      player2_id: m.player2_id,
      round: m.round,
    })),
  });

  console.log(`Bracket generated with ${matchesToCreate.length} matches`);
}
