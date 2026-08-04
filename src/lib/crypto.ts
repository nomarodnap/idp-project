import crypto from "crypto";

const IV_LENGTH = 16;

export function encryptPassword(password: string): string {
  const ENCRYPTION_KEY = crypto.createHash("sha256").update(process.env.ENCRYPTION_SECRET || "").digest("base64").substring(0, 32);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

export function decryptPassword(encrypted: string): string {
  const ENCRYPTION_KEY = crypto.createHash("sha256").update(process.env.ENCRYPTION_SECRET || "").digest("base64").substring(0, 32);
  const [ivHex, encryptedHex] = encrypted.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString("utf8");
}
