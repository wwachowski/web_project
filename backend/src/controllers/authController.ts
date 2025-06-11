import { Request, Response } from "express";
import { sendWarning, sendError, sendMessage, sendMessageWithData } from "../utils/responseHelper";
import { isValidEmail } from "../utils/validators";
import * as userService from "../services/userService";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      sendWarning(res, 400, "Wszystkie pola są wymagane");
      return;
    }

    if (!isValidEmail(email)) {
      sendWarning(res, 400, "Podaj poprawny adres e-mail");
      return;
    }

    await userService.registerUser({
      first_name,
      last_name,
      email,
      password,
    });

    sendMessage(res, 201, "Użytkownik zarejestrowany. Sprawdź e-mail w celu aktywacji.");
  } catch (error: any) {
    if (error.code === "P2002") {
      sendError(res, 409, "Email jest już zajęty");
      return;
    }
    console.error(error);
    sendError(res, 500, "Coś poszło nie tak");
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendWarning(res, 400, "Email i hasło są wymagane");
      return;
    }

    const data = await userService.loginUser({ email, password });
    sendMessageWithData(res, 200, "Zalogowano pomyślnie", data);
  } catch (error: any) {
    sendError(res, 401, error.message || "Błąd logowania");
  }
};
