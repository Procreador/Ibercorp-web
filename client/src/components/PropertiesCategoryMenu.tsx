import { Link } from "wouter";
import { zones } from "@/lib/properties";
import { motion } from "framer-motion";

export default function PropertiesCategoryMenu() {
  const featuredZone = zones.find(z => z.featured);
  const subZones = zones.slice(1, 4); // Almagro, Salamanca, Jerónimos
  const otherZones = zones.filter(z => !z.featured && !z.parent && z.id !== "singulares");
  const singularZone = zones.find(z => z.id === "singulares");

  return (
    <div className="space-y-16 animate-in fade-in duration-1000">
      {/* Featured: MADRID (CAPITAL) */}
      {featuredZone && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link href={`/propiedades?zona=${featuredZone.id}`}>
            <div className="group cursor-pointer relative overflow-hidden bg-gray-100 rounded-sm aspect-[21/9]">
              <img 
                src={featuredZone.menuImage} 
                alt={featuredZone.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.2em] mb-4 uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                  {featuredZone.name}
                </h2>
                <div className="w-16 h-px bg-white/60 mb-6" />
                <p className="max-w-2xl text-base md:text-lg opacity-90 font-light leading-relaxed tracking-wide">
                  {featuredZone.description}
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Grid of Sub-zones (Almagro, Jerónimos, Salamanca) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {subZones.map((zone, i) => (
          <motion.div 
            key={zone.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
          >
            <Link href={`/propiedades?zona=${zone.id}`}>
              <div className="group cursor-pointer space-y-6">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-gray-100 shadow-sm">
                  <img 
                    src={zone.menuImage} 
                    alt={zone.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-light text-gray-900 tracking-[0.2em] uppercase mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                    {zone.name}
                  </h3>
                  <div className="w-8 h-px bg-[#B8A07E] mx-auto mb-3" />
                  <p className="text-gray-500 text-sm font-light leading-relaxed italic">
                    {zone.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Section: OTRAS ZONAS */}
      <div className="pt-20 border-t border-gray-100">
        <h3 className="text-center text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-12 font-medium">OTRAS ZONAS</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {otherZones.map((zone, i) => (
            <motion.div 
              key={zone.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
            >
              <Link href={`/propiedades?zona=${zone.id}`}>
                <div className="group cursor-pointer relative aspect-[4/5] overflow-hidden rounded-sm shadow-md">
                  <img 
                    src={zone.menuImage} 
                    alt={zone.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
                    <h4 className="text-lg md:text-xl font-light tracking-[0.3em] uppercase">
                      {zone.name}
                    </h4>
                    <div className="w-0 group-hover:w-12 h-px bg-[#B8A07E] transition-all duration-500 mt-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
           ))}

           {/* Special card for Singular properties if exists */}
           {singularZone && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8, delay: 0.7 }}
             >
               <Link href={`/propiedades?zona=${singularZone.id}`}>
                 <div className="group cursor-pointer relative aspect-[4/5] overflow-hidden rounded-sm shadow-md border border-[#B8A07E]/20">
                   <img 
                     src={singularZone.menuImage} 
                     alt={singularZone.name}
                     className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-[#2C2C2C]/60 group-hover:bg-[#2C2C2C]/40 transition-colors" />
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
                     <h4 className="text-lg md:text-xl font-light tracking-[0.3em] uppercase text-[#B8A07E]">
                       {singularZone.name}
                     </h4>
                     <p className="text-[10px] tracking-widest mt-2 opacity-80 uppercase">Propiedades Únicas</p>
                   </div>
                 </div>
               </Link>
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
}
