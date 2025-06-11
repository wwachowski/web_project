import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: number;
  email: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ warning: "Brak dostepu" });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const secret = process.env.JWT_SECRET || "tajny_klucz";
    if (!secret) throw new Error("JWT_SECRET nie ustawiony");

    const decoded = jwt.verify(token, secret) as JwtPayload;

    (req as any).user = { id: decoded.userId, email: decoded.email };

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ warning: "Nieprawidłowy token" });
    return;
  }
};
