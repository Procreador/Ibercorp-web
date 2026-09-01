import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { uploadsDir } from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { router as propertiesRouter } from "./routes/properties.js";
import { router as authRouter } from "./routes/auth.js";
import { initBot } from "./bot.js";

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use("/uploads", express.static(uploadsDir, {
    immutable: true,
    maxAge: "30d",
    index: false,
  }));
  app.use("/api/auth", authRouter);
  app.use("/api/properties", propertiesRouter);

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use(express.static(staticPath));

  app.use((
    error: unknown,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        error:
          error.code === "LIMIT_FILE_SIZE"
            ? "Cada imagen debe pesar menos de 10 MB."
            : "No se pudieron procesar las imágenes.",
      });
    }
    if (error instanceof Error && error.message.startsWith("Solo se admiten")) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  });

  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(staticPath, "index.html"));
    } else {
      res.status(404).json({ error: "API endpoint not found" });
    }
  });

  const port = parseInt(process.env.PORT || "3000", 10);
  server.listen(port, "0.0.0.0", () => {
    console.log(`Ibercorp disponible en http://0.0.0.0:${port}/`);
    
    // Launch Telegram Bot
    if (process.env.NODE_ENV === "production" || process.env.TELEGRAM_BOT_TOKEN) {
      console.log("🚀 [Server] Solicitando inicio del bot de Telegram...");
      initBot();
    }
  });
}

startServer().catch(console.error);
