import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { sendActivationEmail } from "../utils/mailer";

const prisma = new PrismaClient();

interface RegisterUserInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface LoginUserInput {
  email: string;
  password: string;
}

export async function registerUser(data: RegisterUserInput) {
  const { first_name, last_name, email, password } = data;

  const password_hash = await bcrypt.hash(password, 10);

  const activation_token = uuidv4();
  const activation_expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);

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

  await sendActivationEmail(user.email, activation_token);

  return user;
}

export async function loginUser(data: LoginUserInput) {
  const { email, password } = data;

  const user = await prisma.users.findUnique({ where: { email } });

  if (!user) throw new Error("Nie ma takiego użytkownika");

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) throw new Error("Niepoprawne hasło");

  if (!user.is_active) {
    const newActivationToken = uuidv4();
    const newActivationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.users.update({
      where: { id: user.id },
      data: {
        activation_token: newActivationToken,
        activation_expires_at: newActivationExpiresAt,
      },
    });

    await sendActivationEmail(user.email, newActivationToken);

    throw new Error("Konto nie jest aktywne. Wysłaliśmy ponownie maila aktywacyjnego.");
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "tajny_klucz", { expiresIn: "1h" });

  return { token, user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name } };
}
