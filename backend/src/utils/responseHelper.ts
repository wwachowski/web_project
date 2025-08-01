import { Response } from "express";

export const sendWarning = (res: Response, status: number, warning: string) => res.status(status).json({ warning });

export const sendError = (res: Response, status: number, error: string) => res.status(status).json({ error, testowy: error });

export const sendMessage = (res: Response, status: number, message: string) => res.status(status).json({ message });

export const sendData = (res: Response, status: number, data: any) => res.status(status).json({ data });

export const sendMessageWithData = (res: Response, status: number, message: string, data: any) => res.status(status).json({ message, data });
