import { useEffect, useRef, useMemo, useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import PropertySidebar from "@/components/PropertySidebar";
import PropertiesCategoryMenu from "@/components/PropertiesCategoryMenu";
import { properties as staticProperties, zones, Property } from "@/lib/properties";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";

export default function Propiedades() {
  const [dbProperties, setDbProperties] = useState<Property[]>([]);
  const [location] = useLocation();

  // Obtener el parámetro de zona de la URL usando window.location.search
  // Al usar useLocation(), el componente se renderiza cuando cambia la URL
  const selectedZone = useMemo(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : "");
    return params.get('zona');
  }, [location]);

  // Scroll al inicio cuando cambia la zona
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedZone]);

  // Cargar propiedades de la base de datos
  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await fetch('/api/properties');
        if (response.ok) {
          const data = await response.json();
          const mappedData: Property[] = data.map((p: any) => ({
            ...p,
            beds: p.bedrooms || 0,
            baths: p.bathrooms || 0,
            m2: p.size || 0,
            ref: p.reference || "REF-SYNC",
            tag: p.badge || "NUEVO",
            images: p.images && p.images.length > 0 ? p.images : ["/img/hero-001.jpg"]
          }));
          setDbProperties(mappedData);
        }
      } catch (error) {
        console.error("Error fetching properties from API:", error);
      }
    }
    fetchProperties();
  }, []);

  // Combinar (De-duplicar por ID, priorizar datos de DB pero mantener fotos estáticas si faltan)
  const allProperties = useMemo(() => {
    const propertyMap = new Map<string, Property>();
    staticProperties.forEach(p => propertyMap.set(p.id, p));
    dbProperties.forEach(p => {
      const existing = propertyMap.get(p.id);
      if (existing) {
        propertyMap.set(p.id, {
          ...existing,
          ...p,
          images: p.images && p.images.length > 0 && !p.images[0].includes('hero-001') 
            ? p.images 
            : existing.images
        });
      } else {
        propertyMap.set(p.id, p);
      }
    });
    return Array.from(propertyMap.values());
  }, [dbProperties, staticProperties]);

  // Filtrar por zona principal o sub-zona
  const filteredProperties = useMemo(() => {
    if (!selectedZone) return [];
    
    // Si la zona seleccionada es una zona padre (ej. madrid-capital)
    // mostramos todas las propiedades de sus hijos también
    const childZones = zones.filter(z => z.parent === selectedZone).map(z => z.id);
    const zonesToInclude = [selectedZone, ...childZones];
    
    return allProperties.filter(p => zonesToInclude.includes(p.zone));
  }, [selectedZone, allProperties]);

  const currentZone = zones.find(z => z.id === selectedZone);

  return (
    <div className="min-h-screen pt-24 bg-white pb-20">
      <AnimatePresence mode="wait">
        {!selectedZone ? (
          <motion.div 
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-[1500px] mx-auto px-6 md:px-12 py-12"
          >
            <div className="flex flex-col lg:flex-row gap-16">
              {/* Columna Principal: Menú de Categorías */}
              <div className="flex-1 order-2 lg:order-first">
                <PropertiesCategoryMenu />
              </div>

              {/* Columna Lateral: Buscador y Filtros */}
              <div className="w-full lg:w-[350px] order-1 lg:order-last">
                <PropertySidebar activeZone={null} />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-[1500px] mx-auto px-6 md:px-12 lg:py-12"
          >
            <div className="flex flex-col lg:flex-row gap-16">
              {/* Listado de Propiedades */}
              <main className="flex-1 order-2 lg:order-first">
                <header className="mb-12 pt-4">
                  <span className="text-[10px] tracking-[0.3em] text-[#B8A07E] uppercase font-bold mb-2 block">
                    {selectedZone === 'singulares' ? 'IBERCORP UNIQUE' : 'DISTRITO'}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-[#2C2C2C] uppercase mb-4" style={{ fontFamily: "var(--font-display)" }}>
                    {currentZone?.name || "Resultados"}
                  </h2>
                  <div className="w-20 h-px bg-[#B8A07E] mb-6" />
                  <p className="text-gray-500 font-light leading-relaxed max-w-2xl">
                    {currentZone?.description}
                  </p>
                </header>

                {filteredProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {filteredProperties.map((property, i) => (
                      <motion.div 
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <PropertyCard property={property} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-32 text-center border border-dashed border-gray-100 rounded-lg">
                    <p className="text-gray-400 font-light text-lg">No se han encontrado propiedades activas en esta sección.</p>
                    <Link href="/propiedades">
                      <button className="mt-6 px-8 py-3 border border-gray-200 text-xs tracking-widest uppercase hover:bg-gray-50 transition-all">
                        Volver al menú
                      </button>
                    </Link>
                  </div>
                )}
              </main>

              {/* Barra Lateral: Filtros en modo listado */}
              <div className="w-full lg:w-[350px] order-1 lg:order-last">
                <PropertySidebar activeZone={selectedZone} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
