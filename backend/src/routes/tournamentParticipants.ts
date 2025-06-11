import { Router } from "express";
import { addParticipant } from "../controllers/tournamentsParticipantsController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/:tournamentId", authMiddleware, addParticipant);

export default router;
