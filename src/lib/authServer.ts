import bcrypt from "bcryptjs";
import crypto from "crypto";

const SALT_ROUNDS = 10;
const RESET_TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
}

export function generateResetToken(): { token: string; expires: number } {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + RESET_TOKEN_EXPIRY_MS;
  return { token, expires };
}
