import fs from "fs";
import path from "path";

const configuredDataDir =
  process.env.DATA_DIR || process.env.RAILWAY_VOLUME_MOUNT_PATH;

export const dataDir = configuredDataDir
  ? path.resolve(configuredDataDir)
  : path.resolve(process.cwd(), "data");

export const uploadsDir = path.join(dataDir, "uploads");
export const databasePath = path.join(dataDir, "properties.db");

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadsDir, { recursive: true });
