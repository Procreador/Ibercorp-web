import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const dbPath = path.resolve(__dirname, "../../data/properties.db");

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
const database = new Database(dbPath);

// Enable WAL mode for better concurrency
database.pragma("journal_mode = WAL");

// Create tables
database.exec(`
  CREATE TABLE IF NOT EXISTS properties (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    address TEXT NOT NULL,
    zone TEXT NOT NULL,
    price TEXT,
    size INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    description TEXT,
    features TEXT,
    images TEXT,
    reference TEXT,
    badge TEXT,
    createdAt TEXT,
    updatedAt TEXT
  )
`);

// Property interface
export interface Property {
  id: string;
  title: string;
  address: string;
  zone: string;
  price?: string;
  size?: number;
  bedrooms?: number;
  bathrooms?: number;
  description?: string;
  features?: string[];
  images?: string[];
  reference?: string;
  badge?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Database operations
export const db = {
  // Get all properties
  getAllProperties(): Property[] {
    const stmt = database.prepare("SELECT * FROM properties ORDER BY createdAt DESC");
    const rows = stmt.all() as any[];
    
    return rows.map(row => ({
      ...row,
      features: row.features ? JSON.parse(row.features) : [],
      images: row.images ? JSON.parse(row.images) : [],
    }));
  },

  // Get property by ID
  getPropertyById(id: string): Property | null {
    const stmt = database.prepare("SELECT * FROM properties WHERE id = ?");
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      ...row,
      features: row.features ? JSON.parse(row.features) : [],
      images: row.images ? JSON.parse(row.images) : [],
    };
  },

  // Get properties by zone
  getPropertiesByZone(zone: string): Property[] {
    const stmt = database.prepare("SELECT * FROM properties WHERE zone = ? ORDER BY createdAt DESC");
    const rows = stmt.all(zone) as any[];
    
    return rows.map(row => ({
      ...row,
      features: row.features ? JSON.parse(row.features) : [],
      images: row.images ? JSON.parse(row.images) : [],
    }));
  },

  // Create property
  createProperty(property: Property): void {
    const stmt = database.prepare(`
      INSERT INTO properties (
        id, title, address, zone, price, size, bedrooms, bathrooms,
        description, features, images, reference, badge, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      property.id,
      property.title,
      property.address,
      property.zone,
      property.price || null,
      property.size || null,
      property.bedrooms || null,
      property.bathrooms || null,
      property.description || null,
      JSON.stringify(property.features || []),
      JSON.stringify(property.images || []),
      property.reference || null,
      property.badge || null,
      property.createdAt || new Date().toISOString(),
      property.updatedAt || new Date().toISOString()
    );
  },

  // Update property
  updateProperty(id: string, property: Partial<Property>): void {
    const existing = this.getPropertyById(id);
    if (!existing) {
      throw new Error(`Property with id ${id} not found`);
    }

    const updated = { ...existing, ...property, updatedAt: new Date().toISOString() };
    
    const stmt = database.prepare(`
      UPDATE properties SET
        title = ?, address = ?, zone = ?, price = ?, size = ?, bedrooms = ?,
        bathrooms = ?, description = ?, features = ?, images = ?, reference = ?,
        badge = ?, updatedAt = ?
      WHERE id = ?
    `);
    
    stmt.run(
      updated.title,
      updated.address,
      updated.zone,
      updated.price || null,
      updated.size || null,
      updated.bedrooms || null,
      updated.bathrooms || null,
      updated.description || null,
      JSON.stringify(updated.features || []),
      JSON.stringify(updated.images || []),
      updated.reference || null,
      updated.badge || null,
      updated.updatedAt,
      id
    );
  },

  // Delete property
  deleteProperty(id: string): void {
    const stmt = database.prepare("DELETE FROM properties WHERE id = ?");
    stmt.run(id);
  },

  // Seed initial data (for testing)
  seedData(properties: Property[]): void {
    const transaction = database.transaction((props: Property[]) => {
      for (const prop of props) {
        this.createProperty(prop);
      }
    });
    
    transaction(properties);
  },
};

// Export database instance for advanced queries
export { database };
