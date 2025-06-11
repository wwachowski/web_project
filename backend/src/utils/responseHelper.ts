import { Response } from "express";

export const sendWarning = (res: Response, status: number, warning: string) =>
  res.status(status).json({ warning });

export const sendError = (res: Response, status: number, error: string) =>
  res.status(status).json({ error });
