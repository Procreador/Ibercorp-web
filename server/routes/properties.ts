import { Router } from "express";
import { verifyToken } from "./auth.js";
import { db } from "../db/index.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const router = Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.resolve(__dirname, "../../client/public/img/properties");
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, uploadDir);
    }
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

// POST create new property (protected)
router.post("/", verifyToken, upload.array("images", 20), async (req, res) => {
  try {
    const propertyData = JSON.parse(req.body.data || "{}");
    const files = req.files as Express.Multer.File[];
    
    // Generate image URLs
    const images = files.map(file => `/img/properties/${file.filename}`);
    
    const newProperty = {
      ...propertyData,
      images,
      id: propertyData.id || uuidv4(),
      createdAt: new Date().toISOString(),
    };
    
    await db.createProperty(newProperty);
    
    res.status(201).json({
      success: true,
      message: "Property created successfully",
      property: newProperty,
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Failed to create property" });
  }
});

// PUT update property (protected)
router.put("/:id", verifyToken, upload.array("images", 20), async (req, res) => {
  try {
    const propertyId = req.params.id;
    const propertyData = JSON.parse(req.body.data || "{}");
    const files = req.files as Express.Multer.File[];
    
    // Check if property exists
    const existingProperty = await db.getPropertyById(propertyId);
    if (!existingProperty) {
      return res.status(404).json({ error: "Property not found" });
    }
    
    // Handle new images
    let images = existingProperty.images || [];
    if (files && files.length > 0) {
      const newImages = files.map(file => `/img/properties/${file.filename}`);
      images = [...images, ...newImages];
    }
    
    const updatedProperty = {
      ...existingProperty,
      ...propertyData,
      images,
      updatedAt: new Date().toISOString(),
    };
    
    await db.updateProperty(propertyId, updatedProperty);
    
    res.json({
      success: true,
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ error: "Failed to update property" });
  }
});

// DELETE property (protected)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const propertyId = req.params.id;
    
    // Check if property exists
    const property = await db.getPropertyById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    
    await db.deleteProperty(propertyId);
    
    res.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting property:", error);
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
