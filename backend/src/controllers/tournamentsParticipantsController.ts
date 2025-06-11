import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendError, sendMessageWithData } from "../utils/responseHelper";

const prisma = new PrismaClient();

export const addParticipant = async (req: Request, res: Response) => {
  try {
    const tournamentId = parseInt(req.params.tournamentId);
    const { license_number, ranking } = req.body;

    if (!tournamentId || !license_number || ranking === undefined) {
      sendError(res, 400, "Wszystkie pola są wymagane");
      return;
    }

    const tournament = await prisma.tournaments.findUnique({ where: { id: tournamentId } });
    if (!tournament) {
      sendError(res, 404, "Turniej nie istnieje");
      return;
    }

    const participant = await prisma.tournament_participants.create({
      data: {
        tournament_id: tournamentId,
        user_id: (req as any).user.id,
        license_number,
        ranking: Number(ranking),
      },
    });

    sendMessageWithData(res, 201, "Zapisano na turniej", { participant });
  } catch (error: any) {
    if (error.code === "P2002") {
      sendError(res, 409, "Użytkownik, numer licencji lub ranking już zapisany na ten turniej");
      return;
    }
    console.error(error);
    sendError(res, 500, "Błąd podczas zapisu na turniej");
  }
};
