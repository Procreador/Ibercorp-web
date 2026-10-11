import { zones, type Property } from "./properties";

export const normalizeSearch = (value: unknown) => String(value ?? "")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  .replace(/[^a-z0-9]+/g, " ").trim();

export function filterProperties(properties: Property[], selectedZone: string | null, query: string) {
  const zoneIds = selectedZone
    ? [selectedZone, ...zones.filter(z => z.parent === selectedZone).map(z => z.id)]
    : [];
  const tokens = normalizeSearch(query).split(/\s+/).filter(Boolean);
  return properties.filter(property => {
    if (zoneIds.length && !zoneIds.some(id => normalizeSearch(id) === normalizeSearch(property.zone))) return false;
    const zone = zones.find(z => normalizeSearch(z.id) === normalizeSearch(property.zone));
    const parent = zones.find(z => z.id === zone?.parent);
    const text = normalizeSearch([property.title, property.address, property.zone, zone?.name,
      parent?.name, property.ref, property.reference, property.id, property.description].join(" "));
    const compact = text.replace(/ /g, "");
    return tokens.every(token => text.includes(token) || compact.includes(token));
  });
}
