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
