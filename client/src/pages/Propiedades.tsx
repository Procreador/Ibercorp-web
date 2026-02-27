import { useEffect, useRef, useMemo } from "react";
import PropertyCard from "@/components/PropertyCard";
import { properties, zones } from "@/lib/properties";

export default function Propiedades() {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Obtener el parámetro de zona de la URL usando window.location.search
  const searchParams = new URLSearchParams(window.location.search);
  const selectedZone = searchParams.get('zona');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedZone]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Filtrar propiedades por zona
  const filteredProperties = useMemo(() => {
    if (!selectedZone) return properties;
    return properties.filter(property => property.zone === selectedZone);
  }, [selectedZone]);

  // Obtener información de la zona seleccionada
  const currentZone = zones.find(z => z.id === selectedZone);
  const title = currentZone ? currentZone.name : "Propiedades";
  const subtitle = currentZone ? currentZone.description : "Selección de inmuebles exclusivos en las mejores ubicaciones de Madrid. Cada propiedad ha sido cuidadosamente seleccionada por nuestro equipo.";

  return (
    <div className="min-h-screen pt-20">
      <div className="py-16 md:py-24 px-6 md:px-12 text-center bg-[#FAFAF7]">
        <span
          className="text-[11px] tracking-[0.2em] text-[#B8A07E] uppercase block mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          CARTERA EXCLUSIVA
        </span>
        <h1
          className="text-3xl md:text-5xl font-light text-[#2C2C2C] tracking-wide mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h1>
        <div className="gold-line mb-6" />
        <p
          className="text-[#6B6560] text-base max-w-xl mx-auto leading-relaxed"
          style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
        >
          {subtitle}
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#B8A07E]/30 to-transparent" />

      <section
        ref={sectionRef}
        className="fade-section py-16 md:py-24 px-6 md:px-12"
      >
        <div className="max-w-[1400px] mx-auto">
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {filteredProperties.map((property, i) => (
                <div
                  key={property.id}
                  className="fade-child"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p
                className="text-[#6B6560] text-lg"
                style={{ fontFamily: "var(--font-body)" }}
              >
                No hay propiedades disponibles en esta zona actualmente.
              </p>
              <p
                className="text-[#B8A07E] text-sm mt-4"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Por favor, contacte con nosotros para más información sobre propiedades off-market.
              </p>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .fade-section {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fade-section.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        .fade-section.animate-in .fade-child {
          opacity: 1;
          transform: translateY(0);
        }
        .fade-child {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
      `}</style>
    </div>
  );
}
