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

  const sortedParticipants = [...participants].sort((a, b) => a.ranking - b.ranking);

  const matchesToCreate = [];
  let currentPlayers = sortedParticipants.map((p) => p.id);
  let round = 1;

  while (currentPlayers.length > 1) {
    const roundMatches: { player1_id: number | null; player2_id: number | null; round: number }[] = [];
    const playersForThisRound = [...currentPlayers];
    currentPlayers = [];

    let farciarz: number | null = null;
    if (playersForThisRound.length % 2 !== 0) {
      farciarz = playersForThisRound.pop()!;
      currentPlayers.push(farciarz);
    }

    if (round === 1) {
      for (let i = playersForThisRound.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playersForThisRound[i], playersForThisRound[j]] = [playersForThisRound[j], playersForThisRound[i]];
      }
    }

    for (let i = 0; i < playersForThisRound.length; i += 2) {
      const player1 = playersForThisRound[i];
      const player2 = playersForThisRound[i + 1];
      roundMatches.push({ player1_id: player1, player2_id: player2, round });
    }

    const numberOfWinners = roundMatches.length + (farciarz ? 1 : 0);
    currentPlayers.length = 0;
    for (let i = 0; i < Math.floor(numberOfWinners / 2); i++) {
      roundMatches.push({ player1_id: null, player2_id: null, round: round + 1 });
      currentPlayers.push(null as unknown as number);
    }
    if (numberOfWinners % 2 !== 0) {
      currentPlayers.push(null as unknown as number);
    }

    matchesToCreate.push(...roundMatches);
    round++;
  }

  await prisma.matches.createMany({
    data: matchesToCreate.map((m) => ({
      tournament_id: tournamentId,
      player1_id: m.player1_id,
      player2_id: m.player2_id,
      round: m.round,
    })),
  });

  console.log(`Bracket generated with ${matchesToCreate.length} matches for tournament ${tournamentId}`);
}

export async function generateBracketsForStartedTournaments() {
  const now = new Date();

  const tournaments = await prisma.tournaments.findMany({
    where: {
      start_time: { lte: now },
      matches: { none: {} },
    },
  });

  console.log(tournaments);

  for (const tournament of tournaments) {
    try {
      await generateBracket(tournament.id);
    } catch (error) {
      console.error(`Failed to generate bracket for tournament ${tournament.id}:`, error);
    }
  }
}
