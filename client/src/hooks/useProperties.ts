import { useCallback, useEffect, useState } from "react";
import type { Property } from "@/lib/properties";

function normalizeProperty(data: any): Property {
  return {
    ...data,
    id: data.id,
    title: data.title || "",
    address: data.address || "Dirección pendiente",
    zone: data.zone || "otras-zonas",
    price: data.price || "Precio a consultar",
    size: data.size || data.m2 || 0,
    bedrooms: data.bedrooms || data.beds || 0,
    bathrooms: data.bathrooms || data.baths || 0,
    m2: data.size || data.m2 || 0,
    beds: data.bedrooms || data.beds || 0,
    baths: data.bathrooms || data.baths || 0,
    year: data.year || "",
    ref: data.reference || data.ref || "REF",
    reference: data.reference || data.ref || "REF",
    tag: data.badge || data.tag || "NUEVO",
    description: data.description || "",
    features: Array.isArray(data.features) ? data.features : [],
    images:
      Array.isArray(data.images) && data.images.length > 0
        ? data.images
        : ["/img/hero-001.jpg"],
  };
}

export async function fetchProperties(signal?: AbortSignal): Promise<Property[]> {
  const response = await fetch("/api/properties", { signal });
  if (!response.ok) throw new Error("No se pudieron cargar las propiedades.");
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error("La respuesta del catálogo no es válida.");
  return data.map(normalizeProperty);
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      setProperties(await fetchProperties(signal));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void refresh(controller.signal).catch(() => undefined);
    return () => controller.abort();
  }, [refresh]);

  return { properties, loading, refresh };
}
