import { useEffect } from "react";
import { Link } from "wouter";

export default function Nosotros() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <div className="py-16 md:py-24 px-6 md:px-12 text-center bg-[#FAFAF7]">
        <span
          className="text-[11px] tracking-[0.2em] text-[#B8A07E] uppercase block mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          QUIÉNES SOMOS
        </span>
        <h1
          className="text-3xl md:text-5xl font-light text-[#2C2C2C] tracking-wide mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Nosotros
        </h1>
        <div className="gold-line" />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#B8A07E]/30 to-transparent" />

      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-light text-[#2C2C2C] mb-8 tracking-wide text-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Gestión inmobiliaria con criterio patrimonial
          </h2>
          <div className="space-y-6">
            <p
              className="text-[#6B6560] text-base leading-[1.85] text-justify"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              Ibercorp nace de la convicción de que la gestión inmobiliaria de alto nivel requiere algo más que 
              intermediación: exige criterio, discreción y un profundo conocimiento del mercado patrimonial madrileño. 
              Nuestro equipo combina experiencia en el sector inmobiliario con formación en derecho, finanzas y 
              arquitectura para ofrecer un acompañamiento verdaderamente integral.
            </p>
            <p
              className="text-[#6B6560] text-base leading-[1.85] text-justify"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              Trabajamos con una cartera selecta de propiedades en las ubicaciones más codiciadas de Madrid — 
              Barrio de Salamanca, Jerónimos, Justicia, Almagro, La Moraleja y Pozuelo de Alarcón — y mantenemos 
              acceso a operaciones off-market que no se encuentran en el mercado abierto.
            </p>
            <p
              className="text-[#6B6560] text-base leading-[1.85] text-justify"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              Cada operación es tratada con la máxima confidencialidad. No buscamos volumen: buscamos resultados 
              que satisfagan las expectativas de clientes exigentes que valoran su patrimonio y su tiempo.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-6 md:px-12 bg-[#1A1A1A] text-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <span
              className="text-[11px] tracking-[0.2em] text-[#B8A07E] uppercase block mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              NUESTROS VALORES
            </span>
            <h2
              className="text-3xl md:text-4xl font-light tracking-wide"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Lo que nos define
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Discreción",
                desc: "La confidencialidad no es un servicio adicional, es la base de nuestra relación con cada cliente. Cada operación se gestiona con la máxima reserva.",
              },
              {
                title: "Criterio",
                desc: "No mostramos todo lo que hay en el mercado. Seleccionamos, analizamos y recomendamos solo aquello que cumple con los estándares más exigentes.",
              },
              {
                title: "Resultados",
                desc: "Nuestro compromiso es con el resultado final. Acompañamos cada operación desde la primera visita hasta la firma, asegurando que cada detalle esté cuidado.",
              },
            ].map((value, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-px bg-[#B8A07E] mx-auto mb-6" />
                <h3
                  className="text-xl font-light mb-4 tracking-wide"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-white/60 text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
                >
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-6 md:px-12 text-center">
        <div className="max-w-xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-light text-[#2C2C2C] mb-6 tracking-wide"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ¿Hablamos?
          </h2>
          <p
            className="text-[#6B6560] text-base leading-relaxed mb-8"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
          >
            Estaremos encantados de atenderle y resolver cualquier consulta sobre nuestros servicios o propiedades disponibles.
          </p>
          <Link
            href="/contacto"
            className="inline-block px-10 py-4 bg-[#2C2C2C] text-white text-[12px] tracking-[0.15em] uppercase hover:bg-[#1A1A1A] transition-colors duration-300"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            CONTACTAR
          </Link>
        </div>
      </section>
    </div>
  );
}
