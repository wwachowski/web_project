import { Request, Response } from "express";
import { sendWarning, sendError } from "../utils/responseHelper";
import * as userService from "../services/userService";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      sendWarning(res, 400, "Wszystkie pola są wymagane");
      return;
    }

    await userService.registerUser({
      first_name,
      last_name,
      email,
      password,
    });

    res.status(201).json({
      message: "Użytkownik zarejestrowany. Sprawdź e-mail w celu aktywacji.",
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      sendError(res, 409, "Email jest już zajęty");
      return;
    }
    console.error(error);
    sendError(res, 500, "Coś poszło nie tak");
    return;
  }
};
