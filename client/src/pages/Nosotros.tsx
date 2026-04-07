import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Nosotros() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
          style={{ 
            backgroundImage: "url('/img/nosotros.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Overlay para legibilidad */}
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[11px] tracking-[0.4em] text-[#B8A07E] uppercase block mb-6 font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            IBERCORP PATRIMONIAL
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-7xl font-light text-white tracking-tight mb-8 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Nosotros
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-px bg-[#B8A07E] mx-auto mb-8" 
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-white/90 text-lg md:text-xl font-light italic max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Gestión inmobiliaria con criterio patrimonial
          </motion.p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-[1px] h-12 bg-white/50 mx-auto" />
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-white relative overflow-hidden">
         {/* Elemento decorativo sutil */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#FAFAF7] -z-10" />
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4 lg:col-span-3">
               <div className="sticky top-32">
                  <span className="text-[10px] tracking-[0.3em] text-[#B8A07E] uppercase font-bold block mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    TRAYECTORIA
                  </span>
                  <div className="text-3xl font-light text-[#2C2C2C] mb-2" style={{ fontFamily: "var(--font-display)" }}>15+</div>
                  <p className="text-[10px] tracking-widest text-gray-400 uppercase leading-relaxed">Años de experiencia especializada</p>
               </div>
            </div>
            
            <div className="md:col-span-8 lg:col-span-9 space-y-10">
              <p
                className="text-[#2C2C2C] text-xl md:text-2xl leading-[1.6] font-light italic bg-gradient-to-r from-[#2C2C2C] to-[#6B6560] bg-clip-text text-transparent"
                style={{ fontFamily: "var(--font-display)" }}
              >
                En IberCorp contamos con más de 15 años de experiencia en la gestión y comercialización de propiedades en las zonas más exclusivas de Madrid y sus alrededores.
              </p>
              
              <div className="h-px w-20 bg-[#B8A07E]/30" />

              <div className="space-y-8 text-[#6B6560] text-base leading-[2] font-light">
                <p>
                  Trabajamos con una cartera cuidadosamente seleccionada de activos inmobiliarios, muchos de ellos fuera del mercado abierto, gestionados bajo criterios de discreción y confianza. Nuestro cliente es exigente y valora la privacidad, la seguridad en cada decisión y un acompañamiento profesional a la altura de la operación.
                </p>
                <p>
                  Asesoramos tanto a compradores finales como a inversores y estructuras patrimoniales que buscan activos singulares, bien ubicados y con valor a largo plazo. Cada propiedad que gestionamos responde a un estándar claro: calidad, ubicación y potencial.
                </p>
                <p>
                  Colaboramos con propietarios que priorizan la confidencialidad y con clientes que buscan acceder a oportunidades que no se encuentran en los canales tradicionales. En IberCorp entendemos cada operación como un proceso que requiere criterio, precisión y una gestión impecable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-[#141414] text-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <span
                className="text-[11px] tracking-[0.3em] text-[#B8A07E] uppercase block mb-4 font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                FILOSOFÍA
              </span>
              <h2
                className="text-4xl md:text-5xl font-light tracking-tight leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Los pilares que <br/>sustentan nuestra gestión
              </h2>
            </div>
            <div className="hidden md:block w-32 h-px bg-[#B8A07E] mb-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                title: "Discreción",
                desc: "La confidencialidad no es un servicio adicional, es la base de nuestra relación con cada cliente. Cada operación se gestiona con la máxima reserva.",
                number: "01"
              },
              {
                title: "Criterio",
                desc: "No mostramos todo lo que hay en el mercado. Seleccionamos, analizamos y recomendamos solo aquello que cumple con los estándares más exigentes.",
                number: "02"
              },
              {
                title: "Resultados",
                desc: "Nuestro compromiso es con el resultado final. Acompañamos cada operación desde la primera visita hasta la firma, asegurando que cada detalle esté cuidado.",
                number: "03"
              },
            ].map((value, i) => (
              <div key={i} className="group cursor-default">
                <span className="text-[10px] tracking-widest text-[#B8A07E] font-bold block mb-6 transition-all duration-500 group-hover:translate-x-2">
                  {value.number}
                </span>
                <h3
                  className="text-2xl font-light mb-6 tracking-wide group-hover:text-[#B8A07E] transition-colors duration-500"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-white/50 text-sm leading-relaxed font-light"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 text-center bg-[#FAFAF7]">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-light text-[#2C2C2C] mb-8 tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Permítanos asesorarle en <br/>su próxima inversión
          </h2>
          <p
            className="text-[#6B6560] text-base leading-relaxed mb-10 font-light italic"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Estaremos encantados de atenderle y resolver cualquier consulta sobre nuestros servicios o propiedades disponibles.
          </p>
          <Link
            href="/contacto"
            className="inline-block px-12 py-5 bg-[#2C2C2C] text-white text-[11px] tracking-[0.3em] uppercase hover:bg-black transition-all duration-500 shadow-xl hover:shadow-2xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            INICIAR CONTACTO
          </Link>
        </div>
      </section>
    </div>
  );
}
