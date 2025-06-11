import { Router } from "express";
import * as tournamentsController from "../controllers/tournamentsController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", tournamentsController.getTournaments);

router.get("/:id", tournamentsController.getTournamentById);

router.post("/", authMiddleware, tournamentsController.upsertTournament);

router.post("/pick/:id", authMiddleware, tournamentsController.pickMatchWinner);

export default router;
