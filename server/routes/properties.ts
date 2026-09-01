import { Router } from "express";
import fs from "fs/promises";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { uploadsDir } from "../config.js";
import { db, type Property } from "../db/index.js";
import { verifyToken } from "./auth.js";

export const router = Router();

const allowedMimeTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, callback) => {
    callback(null, `${uuidv4()}${allowedMimeTypes.get(file.mimetype) || ".jpg"}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 20 },
  fileFilter: (_req, file, callback) => {
    if (allowedMimeTypes.has(file.mimetype)) callback(null, true);
    else callback(new Error("Solo se admiten imágenes JPG, PNG o WebP."));
  },
});

const imagePathSchema = z
  .string()
  .max(500)
  .refine(
    (value) => value.startsWith("/uploads/") || value.startsWith("/img/"),
    "Ruta de imagen no válida",
  );

const numericInput = z.union([z.number(), z.string()]).optional().nullable();

const propertyInputSchema = z
  .object({
    id: z.string().trim().max(160).optional(),
    title: z.string().trim().max(160).optional(),
    address: z.string().trim().max(220).optional(),
    zone: z.string().trim().max(80).optional(),
    price: z.union([z.string().trim().max(80), z.number()]).optional().nullable(),
    size: numericInput,
    sqm: numericInput,
    m2: numericInput,
    superficie: numericInput,
    bedrooms: numericInput,
    beds: numericInput,
    habitaciones: numericInput,
    cuartos: numericInput,
    bathrooms: numericInput,
    baths: numericInput,
    aseos: numericInput,
    year: z.union([z.string(), z.number()]).optional().nullable(),
    description: z.string().trim().max(12000).optional(),
    features: z.array(z.string().trim().min(1).max(240)).max(50).optional(),
    images: z.array(imagePathSchema).max(20).optional(),
    existingImages: z.array(imagePathSchema).max(20).optional(),
    reference: z.string().trim().max(80).optional(),
    ref: z.string().trim().max(80).optional(),
    badge: z.string().trim().max(80).optional(),
    tag: z.string().trim().max(80).optional(),
  })
  .passthrough();

function normalizeText(text = "") {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .replace(/o/g, "0");
}

function toInteger(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const digits = String(value).replace(/[^0-9]/g, "");
  if (!digits) return undefined;
  const number = Number(digits);
  return Number.isSafeInteger(number) ? number : undefined;
}

function normalizePropertyData(raw: unknown): Partial<Property> & {
  existingImages?: string[];
} {
  const data = propertyInputSchema.parse(raw);
  const reference = data.reference || data.ref;
  return {
    id: data.id || (reference ? normalizeText(reference) : undefined),
    title: data.title,
    address: data.address,
    zone: data.zone,
    price:
      data.price === null || data.price === undefined
        ? undefined
        : typeof data.price === "number"
          ? Math.round(data.price)
          : data.price,
    size: toInteger(data.size ?? data.sqm ?? data.m2 ?? data.superficie),
    bedrooms: toInteger(
      data.bedrooms ?? data.beds ?? data.habitaciones ?? data.cuartos,
    ),
    bathrooms: toInteger(data.bathrooms ?? data.baths ?? data.aseos),
    year:
      data.year === null || data.year === undefined ? undefined : String(data.year),
    description: data.description,
    features: data.features,
    images: data.images,
    existingImages: data.existingImages,
    reference,
    badge: data.badge || data.tag,
  };
}

function omitUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  );
}

function uploadedImages(files: Express.Multer.File[] = []): string[] {
  return files.map((file) => `/uploads/${file.filename}`);
}

async function deleteUploadedImage(image: string): Promise<void> {
  if (!image.startsWith("/uploads/")) return;
  const filename = path.basename(image);
  if (!filename || filename !== image.slice("/uploads/".length)) return;

  try {
    await fs.unlink(path.join(uploadsDir, filename));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("No se pudo eliminar una imagen:", error);
    }
  }
}

async function cleanupFiles(files: Express.Multer.File[] = []): Promise<void> {
  await Promise.all(
    files.map((file) => deleteUploadedImage(`/uploads/${file.filename}`)),
  );
}

function parseBody(rawData: unknown) {
  if (typeof rawData !== "string") {
    throw new Error("Faltan los datos de la propiedad.");
  }
  return normalizePropertyData(JSON.parse(rawData));
}

function findProperty(id: string) {
  const direct = db.getPropertyById(id);
  if (direct) return direct;
  const normalizedId = normalizeText(id);
  return (
    db
      .getAllProperties()
      .find(
        (property) =>
          normalizeText(property.id) === normalizedId ||
          normalizeText(property.reference) === normalizedId,
      ) || null
  );
}

router.get("/", (_req, res) => {
  try {
    res.json(db.getAllProperties());
  } catch (error) {
    console.error("Error al consultar propiedades:", error);
    res.status(500).json({ error: "No se pudieron cargar las propiedades." });
  }
});

router.get("/:id", (req, res) => {
  try {
    const property = findProperty(req.params.id);
    if (!property) {
      return res.status(404).json({ error: "Propiedad no encontrada." });
    }
    res.json(property);
  } catch (error) {
    console.error("Error al consultar la propiedad:", error);
    res.status(500).json({ error: "No se pudo cargar la propiedad." });
  }
});

router.post("/", verifyToken, upload.array("images", 20), async (req, res) => {
  const files = (req.files as Express.Multer.File[] | undefined) || [];

  try {
    const data = parseBody(req.body.data);
    if (!data.id || !data.title) {
      await cleanupFiles(files);
      return res.status(400).json({
        error: "La referencia y el título son obligatorios.",
      });
    }

    const existing = findProperty(data.id);
    const retainedImages = data.images || existing?.images || [];
    if (retainedImages.length + files.length > 20) {
      await cleanupFiles(files);
      return res
        .status(400)
        .json({ error: "Se admiten como máximo 20 fotografías." });
    }

    const images = [...retainedImages, ...uploadedImages(files)];
    if (existing) {
      const { existingImages: _existingImages, ...rawUpdates } = data;
      const updates = omitUndefined(rawUpdates) as Partial<Property>;
      const updated = db.updateProperty(existing.id, { ...updates, images });
      return res.json({ success: true, property: updated });
    }

    const property: Property = {
      id: data.id,
      title: data.title,
      address: data.address || "Dirección pendiente",
      zone: data.zone || "otras-zonas",
      price: data.price,
      size: data.size,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      year: data.year,
      description: data.description || "",
      features: data.features || [],
      images,
      reference: data.reference,
      badge: data.badge || "NUEVO",
    };

    const created = db.createProperty(property);
    return res.status(201).json({ success: true, property: created });
  } catch (error) {
    await cleanupFiles(files);
    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      return res.status(400).json({ error: "Revisa los datos del formulario." });
    }
    console.error("Error al crear la propiedad:", error);
    return res.status(500).json({ error: "No se pudo crear la propiedad." });
  }
});

router.put("/:id", verifyToken, upload.array("images", 20), async (req, res) => {
  const files = (req.files as Express.Multer.File[] | undefined) || [];

  try {
    const existing = findProperty(req.params.id);
    if (!existing) {
      await cleanupFiles(files);
      return res.status(404).json({ error: "Propiedad no encontrada." });
    }

    const data = parseBody(req.body.data);
    const retainedImages =
      data.existingImages ?? data.images ?? existing.images ?? [];
    if (retainedImages.length + files.length > 20) {
      await cleanupFiles(files);
      return res
        .status(400)
        .json({ error: "Se admiten como máximo 20 fotografías." });
    }

    const images = [...retainedImages, ...uploadedImages(files)];
    const removedImages = (existing.images || []).filter(
      (image) => !images.includes(image),
    );
    const { existingImages: _existingImages, ...rawUpdates } = data;
    const updates = omitUndefined(rawUpdates) as Partial<Property>;
    const updated = db.updateProperty(existing.id, { ...updates, images });
    await Promise.all(removedImages.map(deleteUploadedImage));

    return res.json({ success: true, property: updated });
  } catch (error) {
    await cleanupFiles(files);
    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      return res.status(400).json({ error: "Revisa los datos del formulario." });
    }
    console.error("Error al actualizar la propiedad:", error);
    return res.status(500).json({ error: "No se pudo actualizar la propiedad." });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const existing = findProperty(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Propiedad no encontrada." });
    }

    db.deleteProperty(existing.id);
    await Promise.all((existing.images || []).map(deleteUploadedImage));
    return res.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar la propiedad:", error);
    return res.status(500).json({ error: "No se pudo eliminar la propiedad." });
  }
});
