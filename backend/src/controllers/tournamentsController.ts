import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { sendError, sendMessageWithData, sendData } from "../utils/responseHelper";

const prisma = new PrismaClient();

export const getTournaments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const search = (req.query.search as string) || "";
    const PAGE_SIZE = 10;

    const whereClause = search
      ? {
          OR: [{ name: { contains: search, mode: Prisma.QueryMode.insensitive } }, { discipline: { contains: search, mode: Prisma.QueryMode.insensitive } }],
        }
      : {};

    const [tournaments, totalCount] = await Promise.all([
      prisma.tournaments.findMany({
        where: whereClause,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        orderBy: { start_time: "desc" },
        select: {
          id: true,
          name: true,
          discipline: true,
          start_time: true,
          application_deadline: true,
        },
      }),
      prisma.tournaments.count({ where: whereClause }),
    ]);

    sendData(res, 200, {
      tournaments,
      pagination: {
        total: totalCount,
        page,
        pageSize: PAGE_SIZE,
        totalPages: Math.ceil(totalCount / PAGE_SIZE),
      },
    });
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Błąd podczas pobierania turniejów");
  }
};

export const getTournamentById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      sendError(res, 400, "Nieprawidłowe ID turnieju");
      return;
    }

    const tournament = await prisma.tournaments.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, email: true, first_name: true, last_name: true } }, // organizator
        sponsor_logos: true,
        tournament_participants: {
          include: {
            users: { select: { id: true, first_name: true, last_name: true } }, // uczestnicy z danymi użytkownika
          },
        },
      },
    });

    if (!tournament) {
      sendError(res, 404, "Nie znaleziono turnieju");
      return;
    }

    const matches = await prisma.matches.findMany({
      where: { tournament_id: id },
      include: {
        users_matches_player1_idTousers: {
          include: {
            users: { select: { id: true, first_name: true, last_name: true } },
          },
        },
        users_matches_player2_idTousers: {
          include: {
            users: { select: { id: true, first_name: true, last_name: true } },
          },
        },
        users_matches_winner_idTousers: {
          include: {
            users: { select: { id: true, first_name: true, last_name: true } },
          },
        },
      },
      orderBy: [{ round: "asc" }, { id: "asc" }],
    });

    const formattedMatches = matches.map((match) => ({
      id: match.id,
      round: match.round,
      player1_id: match.player1_id,
      player2_id: match.player2_id,
      player1_name: match.users_matches_player1_idTousers ? `${match.users_matches_player1_idTousers.users.first_name} ${match.users_matches_player1_idTousers.users.last_name}` : null,
      player2_name: match.users_matches_player2_idTousers ? `${match.users_matches_player2_idTousers.users.first_name} ${match.users_matches_player2_idTousers.users.last_name}` : null,
      player1_user_id: match.users_matches_player1_idTousers?.users.id || null,
      player2_user_id: match.users_matches_player2_idTousers?.users.id || null,
      winner_id: match.winner_id,
      winner_name: match.users_matches_winner_idTousers ? `${match.users_matches_winner_idTousers.users.first_name} ${match.users_matches_winner_idTousers.users.last_name}` : null,
    }));

    sendData(res, 200, { tournament, matches: formattedMatches });
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Błąd podczas pobierania szczegółów turnieju");
  }
};

export const upsertTournament = async (req: Request, res: Response) => {
  try {
    const { id, name, discipline, start_time, location, max_participants, application_deadline, sponsor_logos } = req.body;

    if (!name || !discipline || !start_time || !location || !max_participants || !application_deadline) {
      sendError(res, 400, "Wszystkie pola są wymagane");
      return;
    }

    const startDate = new Date(start_time);
    const deadlineDate = new Date(application_deadline);

    if (isNaN(startDate.getTime()) || isNaN(deadlineDate.getTime())) {
      sendError(res, 400, "Nieprawidłowy format daty");
      return;
    }

    if (startDate < new Date()) {
      sendError(res, 400, "Nie można utworzyć turnieju w przeszłości");
      return;
    }

    if (deadlineDate > startDate) {
      sendError(res, 400, "Deadline na zapisy musi być przed datą rozpoczęcia turnieju");
      return;
    }

    let tournament;

    if (id) {
      const existing = await prisma.tournaments.findUnique({ where: { id: Number(id) } });

      if (!existing) {
        sendError(res, 404, "Turniej nie istnieje");
        return;
      }
      if (existing.organizer_id !== (req as any).user.id) {
        sendError(res, 403, "Nie masz uprawnień do edycji tego turnieju");
        return;
      }

      tournament = await prisma.tournaments.update({
        where: { id: Number(id) },
        data: {
          name,
          discipline,
          start_time: startDate,
          location,
          max_participants: parseInt(max_participants),
          application_deadline: deadlineDate,
        },
      });

      await prisma.sponsor_logos.deleteMany({ where: { tournament_id: tournament.id } });
    } else {
      tournament = await prisma.tournaments.create({
        data: {
          name,
          discipline,
          start_time: startDate,
          location,
          max_participants: parseInt(max_participants),
          application_deadline: deadlineDate,
          organizer_id: (req as any).user.id,
        },
      });
    }

    if (Array.isArray(sponsor_logos)) {
      const sponsorData = sponsor_logos.map((url: string) => ({
        tournament_id: tournament.id,
        url,
      }));

      await prisma.sponsor_logos.createMany({ data: sponsorData });
    }

    sendMessageWithData(res, id ? 200 : 201, id ? "Turniej zaktualizowany" : "Turniej utworzony", { tournament });
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Błąd podczas zapisywania turnieju");
  }
};

export const pickMatchWinner = async (req: Request, res: Response) => {
  try {
    const matchId = parseInt(req.params.id);
    const { winner_id } = req.body;
    const userId = (req as any).user.id;

    if (isNaN(matchId) || typeof winner_id !== "number") {
      sendError(res, 400, "Nieprawidłowe dane wejściowe");
      return;
    }

    // Pobierz mecz
    const match = await prisma.matches.findUnique({
      where: { id: matchId },
      select: {
        id: true,
        player1_id: true,
        player2_id: true,
        player1_winner_pick_id: true,
        player2_winner_pick_id: true,
        winner_id: true,
      },
    });

    if (!match) {
      sendError(res, 404, "Mecz nie istnieje");
      return;
    }

    // Pobierz uczestnika turnieju tego meczu, dla zalogowanego usera
    const participant = await prisma.tournament_participants.findFirst({
      where: {
        user_id: userId,
        id: {
          in: [match.player1_id!, match.player2_id!],
        },
      },
    });

    if (!participant) {
      sendError(res, 403, "Nie masz uprawnień do typowania tego meczu");
      return;
    }

    // Sprawdź, czy wytypowany zwycięzca to faktycznie jeden z uczestników meczu
    if (winner_id !== match.player1_id && winner_id !== match.player2_id) {
      sendError(res, 400, "Wytypowany zwycięzca musi być jednym z uczestników meczu");
      return;
    }

    const isPlayer1 = participant.id === match.player1_id;
    const currentPick = isPlayer1 ? match.player1_winner_pick_id : match.player2_winner_pick_id;
    const otherPick = isPlayer1 ? match.player2_winner_pick_id : match.player1_winner_pick_id;

    let updateData: any = {};

    // Zaktualizuj wybór aktualnego gracza
    if (isPlayer1) {
      updateData.player1_winner_pick_id = winner_id;
    } else {
      updateData.player2_winner_pick_id = winner_id;
    }

    // Jeśli drugi gracz już typował, sprawdzamy konflikt
    if (otherPick !== null) {
      if (otherPick === winner_id) {
        updateData.winner_id = winner_id; // zgadzają się — ustalamy zwycięzcę
      } else {
        // Konflikt — zerujemy typy i winner_id
        updateData.player1_winner_pick_id = null;
        updateData.player2_winner_pick_id = null;
        updateData.winner_id = null;

        await prisma.matches.update({
          where: { id: matchId },
          data: updateData,
        });

        sendError(res, 409, "Konflikt wyboru zwycięzcy — uczestnicy muszą ponownie wytypować zwycięzcę");
        return;
      }
    }

    await prisma.matches.update({
      where: { id: matchId },
      data: updateData,
    });

    sendMessageWithData(res, 200, "Typ zwycięzcy zapisany pomyślnie", { matchId, winner_id });
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Błąd podczas zapisywania typu zwycięzcy");
  }
};
