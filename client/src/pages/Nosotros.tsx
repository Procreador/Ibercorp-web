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
              En IberCorp contamos con más de 15 años de experiencia en la gestión y comercialización de propiedades en las zonas más exclusivas de Madrid y sus alrededores. Trabajamos con una cartera cuidadosamente seleccionada de activos inmobiliarios, muchos de ellos fuera del mercado abierto, gestionados bajo criterios de discreción y confianza.
            </p>
            <p
              className="text-[#6B6560] text-base leading-[1.85] text-justify"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              Nuestro cliente es exigente y valora la privacidad, la seguridad en cada decisión y un acompañamiento profesional a la altura de la operación. Asesoramos tanto a compradores finales como a inversores y estructuras patrimoniales que buscan activos singulares, bien ubicados y con valor a largo plazo.
            </p>
            <p
              className="text-[#6B6560] text-base leading-[1.85] text-justify"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              Cada propiedad que gestionamos responde a un estándar claro: calidad, ubicación y potencial. Colaboramos con propietarios que priorizan la confidencialidad y con clientes que buscan acceder a oportunidades que no se encuentran en los canales tradicionales.
            </p>
            <p
              className="text-[#6B6560] text-base leading-[1.85] text-justify"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              En IberCorp entendemos cada operación como un proceso que requiere criterio, precisión y una gestión impecable.
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
