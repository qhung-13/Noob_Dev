// backend/src/modules/auth/auth.service.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/config/prisma";
import { env } from "@/config/env";
import { ConflictError, UnauthorizedError } from "@/common/errors/AppError";

const SALT_ROUNDS = 10;

function signAccessToken(userId: string, role: string) {
  return jwt.sign({ userId, role }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as NonNullable<
      jwt.SignOptions["expiresIn"]
    >,
  });
}

export const registerUser = async (email: string, password: string, name: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ConflictError("Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await prisma.user.create({
    data: { email, name, passwordHash: hashedPassword },
  });

  const accessToken = signAccessToken(newUser.id, newUser.role);
  const { passwordHash, ...userWithoutPassword } = newUser;

  return { user: userWithoutPassword, accessToken };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const accessToken = signAccessToken(user.id, user.role);
  const { passwordHash, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, accessToken };
};