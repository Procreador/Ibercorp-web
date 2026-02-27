import { Router } from "express";
import crypto from "crypto";

export const router = Router();

// Generate a secure API token (run this once to get your token)
router.post("/generate-token", (req, res) => {
  const token = crypto.randomBytes(32).toString("hex");
  res.json({ 
    token,
    message: "Save this token securely. You'll need it for API authentication."
  });
});

// Middleware to verify API token
export function verifyToken(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  // Get token from environment variable
  const validToken = process.env.API_TOKEN || "ibercorp_dev_token_2024";
  
  if (!token || token !== validToken) {
    return res.status(401).json({ error: "Unauthorized: Invalid or missing token" });
  }
  
  next();
}
