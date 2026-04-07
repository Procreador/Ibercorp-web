import { Link } from "wouter";
import { zones } from "@/lib/properties";
import { motion } from "framer-motion";

export default function PropertiesCategoryMenu() {
  const madridZone = zones.find(z => z.id === "madrid-capital");
  const districtZones = zones.filter(z => ["almagro", "jeronimos", "salamanca"].includes(z.id));
  const otherZones = zones.filter(z => ["zonas-costeras", "otras-zonas", "singulares"].includes(z.id));

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 max-w-[1100px] mx-auto">
      {/* SECCIÓN 1: MADRID (CAPITAL) - HERO */}
      {madridZone && (
        <section className="space-y-8">
          <Link href={`/propiedades?zona=${madridZone.id}`}>
            <div className="group cursor-pointer">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="relative overflow-hidden rounded-sm aspect-[16/8] shadow-sm"
              >
                <img 
                  src="/img/menu_propiedades/Cibeles---Atardecer-Madrid.jpg" 
                  alt="Madrid Capital"
                  className="w-full h-full object-cover shadow-inner transition-transform duration-700 group-hover:scale-105"
                />
              </motion.div>

              <div className="text-center space-y-4 px-4 mt-8">
                <h2 className="text-3xl md:text-4xl font-light tracking-[0.2em] text-[#2C2C2C] uppercase group-hover:text-[#B8A07E] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                  MADRID <span className="text-gray-400 font-light">(CAPITAL)</span>
                </h2>
                <p className="max-w-3xl mx-auto text-sm md:text-base text-[#6B6560] font-light leading-relaxed">
                  Madrid es uno de los mercados inmobiliarios más sólidos de Europa, con <span className="font-semibold text-[#2C2C2C]">una demanda constante</span>, <span className="font-semibold text-[#2C2C2C]">alta seguridad jurídica</span> y <span className="font-semibold text-[#2C2C2C]">una oferta limitada en ubicaciones prime</span>.
                </p>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* SECCIÓN 2: DISTRITOS (ALMAGRO, JERÓNIMOS, SALAMANCA) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {districtZones.map((zone, i) => (
          <motion.div 
            key={zone.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
          >
            <Link href={`/propiedades?zona=${zone.id}`}>
              <div className="group cursor-pointer space-y-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-gray-50 shadow-sm border border-gray-100">
                  <img 
                    src={zone.menuImage} 
                    alt={zone.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-light text-[#2C2C2C] tracking-[0.15em] uppercase hover:text-[#B8A07E] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                    {zone.name}
                  </h3>
                  <div className="w-6 h-px bg-[#B8A07E] mx-auto my-2" />
                  <p className="text-[#888] text-[12px] font-light leading-snug px-2">
                    {zone.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* SECCIÓN 3: OTRAS ZONAS */}
      <section className="pt-8 space-y-8">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px bg-gray-100 flex-1" />
          <h3 className="text-[11px] tracking-[0.4em] uppercase text-gray-400 font-semibold">OTRAS ZONAS</h3>
          <div className="h-px bg-gray-100 flex-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {otherZones.map((zone, i) => (
            <motion.div 
              key={zone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 + i * 0.2 }}
            >
              <Link href={`/propiedades?zona=${zone.id}`}>
                <div className="group cursor-pointer space-y-4">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-gray-50 shadow-sm border border-gray-100">
                    <img 
                      src={zone.menuImage} 
                      alt={zone.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Caption inside for these ones based on visual feel */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 py-2 text-center backdrop-blur-[2px]">
                       <h4 className="text-white text-[10px] tracking-[0.3em] uppercase font-light">
                        {zone.name}
                      </h4>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
