import { Router } from "express";
import * as tournamentsController from "../controllers/tournamentsController";

const router = Router();

router.get("/", tournamentsController.getTournaments);

export default router;
