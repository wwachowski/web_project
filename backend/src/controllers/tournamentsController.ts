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
        users: { select: { id: true, email: true, first_name: true, last_name: true } },
        sponsor_logos: true,
        tournament_participants: true,
      },
    });

    if (!tournament) {
      sendError(res, 404, "Nie znaleziono turnieju");
      return;
    }

    sendData(res, 200, { tournament });
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
