
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import crypto from 'crypto';

const API_URL = 'https://ibercorp-web-production.up.railway.app/api/properties';
const API_TOKEN = 'e7081c644d0aa061495a1381dc6a64064bdeadd6eb6ffa5e';

const dbPath = path.resolve(process.cwd(), 'data/properties.db');
const db = new Database(dbPath);

const properties = db.prepare('SELECT * FROM properties').all();
console.log(`Encontradas ${properties.length} propiedades locales.`);

async function sync() {
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  
  for (const prop of properties) {
    try {
      const propertyData = {
        id: prop.id || crypto.randomUUID(),
        title: prop.title,
        description: prop.description,
        price: prop.price,
        type: prop.type,
        status: prop.status,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        size: prop.sqft || prop.size,
        address: prop.address || 'Dirección pendiente',
        zone: prop.zone || 'Zona pendiente',
        featured: prop.featured ? true : false,
        reference: prop.reference
      };

      const body = `--${boundary}\r\nContent-Disposition: form-data; name="data"\r\n\r\n${JSON.stringify(propertyData)}\r\n--${boundary}--`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: body
      });

      if (response.ok) {
        console.log(`✅ Sincronizada: ${prop.title}`);
      } else {
        const error = await response.text();
        console.error(`❌ Error sincronizando ${prop.title}: ${response.status} - ${error}`);
      }
    } catch (err) {
      console.error(`💥 Fallo crítico en ${prop.title}: ${err.message}`);
    }
  }
}

sync().then(() => console.log('Proceso terminado.'));
