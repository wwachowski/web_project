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
      // farciarz automatycznie przechodzi do następnej rundy (dodajemy go w currentPlayers)
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

// Funkcja aktualizująca kolejne rundy na podstawie wyników meczów z rundy poprzedniej
async function fillNextRounds(tournamentId: number) {
  // Pobierz wszystkie mecze dla turnieju, posortowane po rundzie i ID
  const matches = await prisma.matches.findMany({
    where: { tournament_id: tournamentId },
    orderBy: [
      { round: "asc" },
      { id: "asc" }
    ],
  });

  if (matches.length === 0) return; // brak meczów, nic do uzupełnienia

  // Grupuj mecze po rundach
  const roundsMap = new Map<number, typeof matches>();
  for (const m of matches) {
    if (!roundsMap.has(m.round)) roundsMap.set(m.round, []);
    roundsMap.get(m.round)!.push(m);
  }

  const rounds = Array.from(roundsMap.keys()).sort((a, b) => a - b);

  // Od rundy 2 i dalej przypisz zwycięzców do player1_id i player2_id na podstawie wyników rundy poprzedniej
  for (let i = 1; i < rounds.length; i++) {
    const prevRound = rounds[i - 1];
    const currRound = rounds[i];
    const prevMatches = roundsMap.get(prevRound)!;
    const currMatches = roundsMap.get(currRound)!;

    // Sprawdź, czy wszystkie mecze w rundzie poprzedniej mają wyłonionego zwycięzcę
    if (prevMatches.some(m => !m.winner_id)) {
      // Nie wszystkie zakończone, nie wypełniamy rundy aktualnej
      break;
    }

    // Tworzymy tablicę zwycięzców poprzedniej rundy, w kolejności meczów
    const winners = prevMatches.map(m => m.winner_id!);

    // Wypełniamy mecze aktualnej rundy parami zwycięzców
    for (let j = 0; j < currMatches.length; j++) {
      const match = currMatches[j];
      const idx1 = j * 2;
      const idx2 = j * 2 + 1;

      const player1 = winners[idx1] ?? null;
      const player2 = winners[idx2] ?? null;

      // Aktualizuj jeśli jest różnica (np. wcześniej null, teraz wypełnione)
      if (match.player1_id !== player1 || match.player2_id !== player2) {
        await prisma.matches.update({
          where: { id: match.id },
          data: {
            player1_id: player1,
            player2_id: player2,
          }
        });
      }
    }
  }
}

export async function generateBracketsForStartedTournaments() {
  const now = new Date();

  const tournaments = await prisma.tournaments.findMany({
    where: {
      start_time: { lte: now },
      matches: { none: {} }, // turnieje bez meczów
    },
  });

  console.log("Tournaments to generate:", tournaments);

  for (const tournament of tournaments) {
    try {
      await generateBracket(tournament.id);
    } catch (error) {
      console.error(`Failed to generate bracket for tournament ${tournament.id}:`, error);
    }
  }

  // Teraz uzupełnij rundy dla turniejów które mają już mecz
  const tournamentsWithMatches = await prisma.tournaments.findMany({
    where: {
      start_time: { lte: now },
      matches: { some: {} }, // turnieje z meczami
    },
  });

  for (const tournament of tournamentsWithMatches) {
    try {
      await fillNextRounds(tournament.id);
    } catch (error) {
      console.error(`Failed to fill next rounds for tournament ${tournament.id}:`, error);
    }
  }

  console.log("Finished generating and filling brackets");
}
