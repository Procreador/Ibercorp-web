import { db } from "./index.js";
import { properties } from "../../client/src/lib/properties.js";

// Migrate existing properties from properties.ts to database
async function migrate() {
  console.log("🔄 Starting migration...");
  console.log(`📊 Found ${properties.length} properties to migrate`);
  
  try {
    // Clear existing data
    const existingProps = db.getAllProperties();
    console.log(`🗑️  Clearing ${existingProps.length} existing properties...`);
    
    for (const prop of existingProps) {
      db.deleteProperty(prop.id);
    }
    
    // Insert properties
    console.log("📥 Inserting properties...");
    db.seedData(properties);
    
    // Verify
    const migratedProps = db.getAllProperties();
    console.log(`✅ Migration complete! ${migratedProps.length} properties in database`);
    
    // Show summary
    const zones = new Set(migratedProps.map(p => p.zone));
    console.log(`📍 Zones: ${Array.from(zones).join(", ")}`);
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
