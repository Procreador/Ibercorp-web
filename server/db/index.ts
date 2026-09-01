import Database from "better-sqlite3";
import { databasePath } from "../config.js";

const database = new Database(databasePath);
database.pragma("journal_mode = WAL");
database.pragma("foreign_keys = ON");

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
    year TEXT,
    description TEXT,
    features TEXT,
    images TEXT,
    reference TEXT,
    badge TEXT,
    createdAt TEXT,
    updatedAt TEXT
  )
`);

const columns = database
  .prepare("PRAGMA table_info(properties)")
  .all() as Array<{ name: string }>;

if (!columns.some((column) => column.name === "year")) {
  database.exec("ALTER TABLE properties ADD COLUMN year TEXT");
}

export interface Property {
  id: string;
  title: string;
  address: string;
  zone: string;
  price?: string | number;
  size?: number;
  bedrooms?: number;
  bathrooms?: number;
  year?: string;
  description?: string;
  features?: string[];
  images?: string[];
  reference?: string;
  badge?: string;
  createdAt?: string;
  updatedAt?: string;
}

type PropertyRow = {
  id: string;
  title: string;
  address: string;
  zone: string;
  price: string | null;
  size: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  year: string | null;
  description: string | null;
  features: string | null;
  images: string | null;
  reference: string | null;
  badge: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

function parseStringArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function toProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    title: row.title,
    address: row.address,
    zone: row.zone,
    price: row.price ?? undefined,
    size: row.size ?? undefined,
    bedrooms: row.bedrooms ?? undefined,
    bathrooms: row.bathrooms ?? undefined,
    year: row.year ?? undefined,
    description: row.description ?? undefined,
    features: parseStringArray(row.features),
    images: parseStringArray(row.images),
    reference: row.reference ?? undefined,
    badge: row.badge ?? undefined,
    createdAt: row.createdAt ?? undefined,
    updatedAt: row.updatedAt ?? undefined,
  };
}

export const db = {
  getAllProperties(): Property[] {
    const rows = database
      .prepare("SELECT * FROM properties ORDER BY createdAt DESC")
      .all() as PropertyRow[];
    return rows.map(toProperty);
  },

  getPropertyById(id: string): Property | null {
    const row = database
      .prepare("SELECT * FROM properties WHERE id = ?")
      .get(id) as PropertyRow | undefined;
    return row ? toProperty(row) : null;
  },

  getPropertiesByZone(zone: string): Property[] {
    const rows = database
      .prepare("SELECT * FROM properties WHERE zone = ? ORDER BY createdAt DESC")
      .all(zone) as PropertyRow[];
    return rows.map(toProperty);
  },

  createProperty(property: Property): Property {
    const now = new Date().toISOString();
    const createdAt = property.createdAt || now;
    const updatedAt = property.updatedAt || now;

    database
      .prepare(`
        INSERT INTO properties (
          id, title, address, zone, price, size, bedrooms, bathrooms, year,
          description, features, images, reference, badge, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        property.id,
        property.title,
        property.address || "Dirección pendiente",
        property.zone || "otras-zonas",
        property.price === undefined || property.price === null
          ? null
          : String(property.price),
        property.size ?? null,
        property.bedrooms ?? null,
        property.bathrooms ?? null,
        property.year || null,
        property.description || null,
        JSON.stringify(property.features || []),
        JSON.stringify(property.images || []),
        property.reference || null,
        property.badge || null,
        createdAt,
        updatedAt,
      );

    return { ...property, createdAt, updatedAt };
  },

  updateProperty(id: string, property: Partial<Property>): Property {
    const existing = this.getPropertyById(id);
    if (!existing) throw new Error(`Property with id ${id} not found`);

    const updated: Property = {
      ...existing,
      ...property,
      id,
      features: property.features ?? existing.features,
      images: property.images ?? existing.images,
      updatedAt: new Date().toISOString(),
    };

    database
      .prepare(`
        UPDATE properties SET
          title = ?, address = ?, zone = ?, price = ?, size = ?, bedrooms = ?,
          bathrooms = ?, year = ?, description = ?, features = ?, images = ?,
          reference = ?, badge = ?, updatedAt = ?
        WHERE id = ?
      `)
      .run(
        updated.title,
        updated.address,
        updated.zone,
        updated.price === undefined || updated.price === null
          ? null
          : String(updated.price),
        updated.size ?? null,
        updated.bedrooms ?? null,
        updated.bathrooms ?? null,
        updated.year || null,
        updated.description || null,
        JSON.stringify(updated.features || []),
        JSON.stringify(updated.images || []),
        updated.reference || null,
        updated.badge || null,
        updated.updatedAt,
        id,
      );

    return updated;
  },

  deleteProperty(id: string): void {
    database.prepare("DELETE FROM properties WHERE id = ?").run(id);
  },

  seedData(properties: Property[]): void {
    const transaction = database.transaction((items: Property[]) => {
      for (const property of items) this.createProperty(property);
    });
    transaction(properties);
  },
};

export { database };
