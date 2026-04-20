import { Router } from "express";
import { verifyToken } from "./auth.js";
import { db } from "../db/index.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import fsSync from "fs";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const router = Router();

// Normalizador Universal de datos (Idealista style)
const normalizePropertyData = (data: any) => {
  const normalized = { ...data };
  
  // Mapeo de Área (sqm, m2, metros -> size)
  normalized.size = data.size || data.sqm || data.m2 || data.superficie || null;
  
  // Mapeo de Dormitorios (beds, habitaciones -> bedrooms)
  normalized.bedrooms = data.bedrooms || data.beds || data.habitaciones || data.cuartos || null;
  
  // Mapeo de Baños (baths, aseos -> bathrooms)
  normalized.bathrooms = data.bathrooms || data.baths || data.aseos || null;

  // Limpieza de tipos (asegurar números)
  if (normalized.size) normalized.size = parseInt(normalized.size.toString().replace(/[^0-9]/g, ''));
  if (normalized.bedrooms) normalized.bedrooms = parseInt(normalized.bedrooms.toString().replace(/[^0-9]/g, ''));
  if (normalized.bathrooms) normalized.bathrooms = parseInt(normalized.bathrooms.toString().replace(/[^0-9]/g, ''));
  if (normalized.price) normalized.price = parseFloat(normalized.price.toString().replace(/[^0-9.]/g, ''));

  return normalized;
};

// Normalización Universal de texto (acentos, mayúsculas, etc.)
const normalizeText = (text: string) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/[^a-z0-9]/g, "")      // Solo alfanumérico
    .replace(/o/g, '0');            // Normalizar O por 0 para referencias
};

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Subida síncrona para evitar errores de Multer con callbacks asíncronos
    const uploadDir = path.resolve(process.cwd(), "data", "images");
    if (!fsSync.existsSync(uploadDir)) {
      fsSync.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (jpeg, jpg, png, webp)"));
    }
  },
});

// GET all properties (public)
router.get("/", async (req, res) => {
  try {
    const properties = await db.getAllProperties();
    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

// GET single property by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const property = await db.getPropertyById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: "Failed to fetch property" });
  }
});

// POST create or update property (Smart Upsert)
router.post("/", verifyToken, upload.array("images", 20), async (req, res) => {
  try {
    const rawData = JSON.parse(req.body.data || "{}");
    const propertyData = normalizePropertyData(rawData);
    
    // Generar ID único basado en referencia si no existe
    if (!propertyData.id && propertyData.reference) {
      propertyData.id = normalizeText(propertyData.reference);
    }

    if (!propertyData.id || !propertyData.title) {
      return res.status(400).json({ error: "Missing required fields (id/reference and title)" });
    }

    const files = req.files as Express.Multer.File[];
    const imageUrls = files.map(file => `/images/${file.filename}`);
    
    const existing = await db.getPropertyById(propertyData.id);
    
    if (existing) {
      // SMART UPSERT: Si existe, actualizamos
      const updatedImages = [...(existing.images || []), ...imageUrls];
      await db.updateProperty(propertyData.id, { 
        ...propertyData, 
        images: updatedImages 
      });
      
      const updated = await db.getPropertyById(propertyData.id);
      return res.status(200).json({
        success: true,
        message: "Property updated successfully (Upsert)",
        property: updated,
      });
    } else {
      // Creación normal
      const newProperty = {
        ...propertyData,
        images: imageUrls,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.createProperty(newProperty as any);
      return res.status(201).json({
        success: true,
        message: "Property created successfully",
        property: newProperty,
      });
    }
  } catch (error: any) {
    console.error("❌ [API POST Error]:", error.message);
    res.status(500).json({ error: "Operation failed", details: error.message });
  }
});

// PUT update property (protected with Fuzzy Search)
router.put("/:id", verifyToken, upload.array("images", 20), async (req, res) => {
  try {
    const id = req.params.id;
    const rawData = JSON.parse(req.body.data || "{}");
    const propertyData = normalizePropertyData(rawData);
    const files = req.files as Express.Multer.File[];
    
    let existing = await db.getPropertyById(id);
    
    // Búsqueda flexible si no hay ID exacto
    if (!existing) {
      const all = await db.getAllProperties();
      existing = all.find(p => normalizeText(p.id) === normalizeText(id) || normalizeText(p.reference) === normalizeText(id));
    }

    if (!existing) {
      return res.status(404).json({ error: "Property not found" });
    }
    
    let images = existing.images || [];
    if (files && files.length > 0) {
      const newImages = files.map(file => `/images/${file.filename}`);
      images = [...images, ...newImages];
    }
    
    const updatedProperty = {
      ...existing,
      ...propertyData,
      images,
      updatedAt: new Date().toISOString(),
    };
    
    await db.updateProperty(existing.id, updatedProperty);
    
    res.json({
      success: true,
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error: any) {
    console.error("❌ [API Update Error]:", error.message);
    res.status(500).json({ error: "Failed to update property", details: error.message });
  }
});

// DELETE property (protected with Fuzzy Search)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    let existing = await db.getPropertyById(id);
    
    if (!existing) {
      const all = await db.getAllProperties();
      existing = all.find(p => normalizeText(p.id) === normalizeText(id) || normalizeText(p.reference) === normalizeText(id));
    }

    if (!existing) {
      return res.status(404).json({ error: "Property not found" });
    }
    
    await db.deleteProperty(existing.id);
    
    res.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error: any) {
    console.error("❌ [API Delete Error]:", error.message);
    res.status(500).json({ error: "Failed to delete property" });
  }
});

// POST upload images for existing property (protected)
router.post("/:id/images", verifyToken, upload.array("images", 20), async (req, res) => {
  try {
    const propertyId = req.params.id;
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No images provided" });
    }
    
    const property = await db.getPropertyById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    
    const newImages = files.map(file => `/img/properties/${file.filename}`);
    const updatedImages = [...(property.images || []), ...newImages];
    
    await db.updateProperty(propertyId, {
      ...property,
      images: updatedImages,
      updatedAt: new Date().toISOString(),
    });
    
    res.json({
      success: true,
      message: `${newImages.length} image(s) uploaded successfully`,
      images: newImages,
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
});
