import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { sendActivationEmail } from "../utils/mailer";

const prisma = new PrismaClient();

interface RegisterUserInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export async function registerUser(data: RegisterUserInput) {
  const { first_name, last_name, email, password } = data;

  // Hashowanie hasła
  const password_hash = await bcrypt.hash(password, 10);

  // Generowanie tokena aktywacyjnego i daty wygaśnięcia (24h)
  const activation_token = uuidv4();
  const activation_expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Tworzenie użytkownika w bazie
  const user = await prisma.users.create({
    data: {
      first_name,
      last_name,
      email,
      password_hash,
      is_active: false,
      activation_token,
      activation_expires_at,
    },
  });

  // Wysyłanie maila aktywacyjnego
  await sendActivationEmail(user.email, activation_token);

  return user;
}
