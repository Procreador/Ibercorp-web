import { useEffect, useRef } from "react";
import { Link } from "wouter";
import HeroCarousel from "@/components/HeroCarousel";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/lib/properties";

export default function Home() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      <HeroCarousel />

      <section
        ref={(el) => { sectionRefs.current[0] = el; }}
        className="fade-section py-24 md:py-32 px-6 md:px-12"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-light text-[#2C2C2C] mb-6 tracking-wide"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Acceso a cartera privada
          </h2>
          <div className="gold-line mb-8" />
          <p
            className="text-[#6B6560] text-base md:text-lg leading-[1.85] mb-10"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
          >
            En Ibercorp realizamos una selección exquisita de los inmuebles más destacados en Madrid. 
            Explore zonas y barrios desde nuestra sección de propiedades. Para operaciones off-market, 
            contacte directamente con nuestro equipo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/propiedades"
              className="inline-block px-8 py-3.5 bg-[#2C2C2C] text-white text-[12px] tracking-[0.15em] uppercase hover:bg-[#1A1A1A] transition-colors duration-300"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              VER PROPIEDADES
            </Link>
            <Link
              href="/contacto"
              className="inline-block px-8 py-3.5 border border-[#2C2C2C] text-[#2C2C2C] text-[12px] tracking-[0.15em] uppercase hover:bg-[#2C2C2C] hover:text-white transition-all duration-300"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              CONTACTO
            </Link>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#B8A07E]/30 to-transparent max-w-4xl mx-auto" />

      <section
        ref={(el) => { sectionRefs.current[1] = el; }}
        className="fade-section py-24 md:py-32 px-6 md:px-12"
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <span
              className="text-[11px] tracking-[0.2em] text-[#B8A07E] uppercase block mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              SELECCIÓN EXCLUSIVA
            </span>
            <h2
              className="text-3xl md:text-4xl font-light text-[#2C2C2C] tracking-wide"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Propiedades destacadas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {properties.slice(0, 3).map((property, i) => (
              <div
                key={property.id}
                className="fade-child"
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/propiedades"
              className="inline-block text-[12px] tracking-[0.15em] uppercase text-[#2C2C2C] border-b border-[#B8A07E] pb-1 hover:text-[#B8A07E] transition-colors duration-300"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              VER TODAS LAS PROPIEDADES
            </Link>
          </div>
        </div>
      </section>

      <section
        ref={(el) => { sectionRefs.current[2] = el; }}
        className="fade-section relative py-28 md:py-36 px-6 md:px-12 bg-[#1A1A1A] text-white overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px"
          }} />
        </div>

        <div className="relative max-w-2xl mx-auto text-center">
          <span
            className="text-[11px] tracking-[0.2em] text-[#B8A07E] uppercase block mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            DISCRECIÓN Y CONFIANZA
          </span>
          <h2
            className="text-3xl md:text-4xl font-light tracking-wide mb-6 leading-snug"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ¿Busca una propiedad exclusiva en Madrid?
          </h2>
          <div className="w-12 h-px bg-[#B8A07E] mx-auto mb-8" />
          <p
            className="text-white/70 text-base leading-relaxed mb-10 max-w-lg mx-auto"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
          >
            Nuestro equipo le ofrece acceso a propiedades que no encontrará en el mercado abierto. 
            Contacte con nosotros para una consulta confidencial.
          </p>
          <Link
            href="/contacto"
            className="inline-block px-10 py-4 border border-[#B8A07E] text-[#B8A07E] text-[12px] tracking-[0.15em] uppercase hover:bg-[#B8A07E] hover:text-[#1A1A1A] transition-all duration-300"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            CONTACTAR
          </Link>
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
