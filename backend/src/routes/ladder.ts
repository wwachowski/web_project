import { Router } from "express";
import { generateBracketsForStartedTournaments } from "../services/bracketService";
import { Response, Request } from "express";

const router = Router();

export const generateBrackets = async (req: Request, res: Response) => {
  try {
    console.error("error");
    await generateBracketsForStartedTournaments();
    res.status(200).json({ test: "Brackets generated successfully" });
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500);
  }
};

router.get("/generate", generateBrackets);

export default router;
