import { useState } from "react";
import { Link } from "wouter";
import { zones } from "@/lib/properties";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";

interface PropertySidebarProps {
  activeZone?: string | null;
}

export default function PropertySidebar({ activeZone }: PropertySidebarProps) {
  const [search, setSearch] = useState("");

  const mainGroups = [
    {
      id: "madrid-capital",
      title: "MADRID (CAPITAL)",
      subItems: zones.filter(z => z.parent === "madrid-capital")
    },
    {
      id: "areas-residenciales",
      title: "ÁREAS RESIDENCIALES",
      subItems: zones.filter(z => z.parent === "areas-residenciales")
    }
  ];

  const independentZones = zones.filter(z => !z.parent && !z.featured && z.id !== "singulares" && z.id !== "areas-residenciales");

  return (
    <aside className="w-full bg-white border border-gray-100 p-8 shadow-sm h-fit lg:sticky lg:top-24">
      <div className="space-y-12">
        {/* Search */}
        <div className="space-y-4">
          <h3 className="text-[11px] tracking-[0.25em] font-bold text-[#2C2C2C] uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
            BUSCAR PROPIEDADES
          </h3>
          <div className="relative group">
            <Input 
              placeholder="Zona, barrio, ID..." 
              className="pl-4 pr-10 py-5 border-gray-200 rounded-none focus:ring-0 focus:border-[#B8A07E] bg-white transition-all text-sm font-light italic"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-[#B8A07E] transition-colors w-4 h-4" />
          </div>
        </div>

        {/* Categories / Zones */}
        <div className="space-y-1.5">
           {/* All Properties / Reset */}
           <Link href="/propiedades">
            <div className={`flex items-center justify-between cursor-pointer py-2 border-b border-gray-50 group hover:pl-2 transition-all ${!activeZone ? 'text-[#B8A07E]' : 'text-gray-800'}`}>
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 opacity-50" />
                <span className="text-[11px] tracking-widest font-bold uppercase transition-colors">Todas las Propiedades</span>
              </div>
              <ChevronRight className="w-3 h-3 opacity-30 group-hover:opacity-100" />
            </div>
          </Link>

          {mainGroups.map(group => (
            <div key={group.id} className="border-b border-gray-50 pb-0.5 last:border-0 md:last:border-b">
              <details open={activeZone === group.id || group.subItems.some(s => s.id === activeZone)} className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none text-[11px] tracking-widest font-bold text-gray-800 hover:text-[#B8A07E] transition-all py-2 uppercase">
                  <div className="flex items-center gap-2">
                    <ChevronDown className={`w-3 h-3 text-[#B8A07E] transition-transform ${activeZone === group.id ? 'rotate-0' : 'group-open:rotate-180'}`} />
                    <span>{group.title}</span>
                  </div>
                </summary>
                <div className="mt-0.5 space-y-0 pl-5 border-l border-gray-100 ml-1.5 mb-2">
                   <Link href={`/propiedades?zona=${group.id}`}>
                    <span className={`block text-[12px] py-2 cursor-pointer transition-colors ${activeZone === group.id ? "text-[#B8A07E] font-medium" : "text-gray-500 hover:text-gray-900"}`}>
                      Ver todo en {group.title.toLowerCase()}
                    </span>
                  </Link>
                  {group.subItems.map(item => (
                    <Link key={item.id} href={`/propiedades?zona=${item.id}`}>
                      <span className={`block text-[12px] py-1.5 cursor-pointer transition-colors ${activeZone === item.id ? "text-[#B8A07E] font-medium" : "text-gray-500 hover:text-gray-900"}`}>
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </details>
            </div>
          ))}

          {/* Independent Zones */}
          {independentZones.map(zone => (
            <div key={zone.id} className="border-b border-gray-50 pb-0.5">
               <Link href={`/propiedades?zona=${zone.id}`}>
                <div className="flex items-center justify-between cursor-pointer text-[11px] tracking-widest font-bold text-gray-800 hover:text-[#B8A07E] transition-all py-2 uppercase">
                  <span>{zone.name}</span>
                  <ChevronRight className={`w-3 h-3 transition-opacity ${activeZone === zone.id ? 'opacity-100 text-[#B8A07E]' : 'opacity-30'}`} />
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Global Action Button */}
        <Link href="/propiedades?zona=singulares">
          <button className={`w-full py-4 text-[10px] tracking-[0.35em] uppercase transition-all duration-500 font-bold shadow-md border ${activeZone === 'singulares' ? 'bg-[#B8A07E] border-[#B8A07E] text-white' : 'bg-[#212121] border-[#212121] text-[#B8A07E] hover:bg-black hover:border-black'}`}>
            Propiedades Singulares
          </button>
        </Link>
      </div>
    </aside>
  );
}
