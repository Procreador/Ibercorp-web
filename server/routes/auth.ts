import { Router, type NextFunction, type Request, type Response } from "express";
import crypto from "crypto";

export const router = Router();

const COOKIE_NAME = "ibercorp_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    crypto.timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || process.env.API_TOKEN || "";
}

function getSessionSecret() {
  return (
    process.env.SESSION_SECRET ||
    process.env.API_TOKEN ||
    process.env.ADMIN_PASSWORD ||
    "ibercorp-development-only"
  );
}

function signSession(expiresAt: number) {
  const payload = String(expiresAt);
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

function parseCookies(cookieHeader = "") {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separator = part.indexOf("=");
        if (separator === -1) return [part, ""];
        return [
          part.slice(0, separator),
          decodeURIComponent(part.slice(separator + 1)),
        ];
      }),
  );
}

function hasValidSession(req: Request) {
  const raw = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (!raw) return false;

  const [expiresRaw, signature] = raw.split(".");
  const expiresAt = Number(expiresRaw);
  if (!expiresAt || !signature || Date.now() > expiresAt) return false;

  return safeEqual(signSession(expiresAt), raw);
}

router.post("/login", (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (attempt && attempt.resetAt > now && attempt.count >= 5) {
    return res
      .status(429)
      .json({ error: "Demasiados intentos. Prueba de nuevo en 15 minutos." });
  }

  const validPassword = getAdminPassword();
  if (!validPassword) {
    return res.status(503).json({
      error: "El acceso de administración todavía no está configurado.",
    });
  }

  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!safeEqual(password, validPassword)) {
    const nextAttempt =
      attempt && attempt.resetAt > now
        ? { count: attempt.count + 1, resetAt: attempt.resetAt }
        : { count: 1, resetAt: now + 15 * 60 * 1000 };
    loginAttempts.set(ip, nextAttempt);
    return res.status(401).json({ error: "Clave incorrecta." });
  }

  loginAttempts.delete(ip);
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(signSession(expiresAt))}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS};${process.env.NODE_ENV === "production" ? " Secure;" : ""}`,
  );
  return res.json({ authenticated: true });
});

router.post("/logout", (_req, res) => {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0;${process.env.NODE_ENV === "production" ? " Secure;" : ""}`,
  );
  return res.json({ authenticated: false });
});

router.get("/session", (req, res) => {
  return res.json({ authenticated: hasValidSession(req) });
});

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const validToken = process.env.API_TOKEN || "";
  const bearerIsValid = Boolean(
    token && validToken && safeEqual(token, validToken),
  );

  if (!bearerIsValid && !hasValidSession(req)) {
    return res.status(401).json({ error: "No autorizado." });
  }

  next();
}
