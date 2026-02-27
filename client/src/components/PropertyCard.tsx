import { Link } from "wouter";
import type { Property } from "@/lib/properties";
import { MapPin, Maximize, BedDouble, Bath } from "lucide-react";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/propiedad/${property.id}`}>
      <article className="group cursor-pointer">
        <div className="relative overflow-hidden aspect-[4/3] rounded-sm">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
          <div
            className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[10px] tracking-[0.15em] uppercase text-[#2C2C2C]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {property.tag}
          </div>
          <div
            className="absolute top-4 right-4 px-3 py-1.5 text-[10px] tracking-[0.1em] text-white/70"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {property.ref}
          </div>
        </div>

        <div className="pt-5 pb-2">
          <h3
            className="text-xl font-normal text-[#2C2C2C] mb-2 group-hover:text-[#B8A07E] transition-colors duration-300"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {property.title}
          </h3>
          <div className="flex items-center gap-1.5 text-[#6B6560] mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm" style={{ fontFamily: "var(--font-body)" }}>
              {property.address}
            </span>
          </div>

          <div className="flex items-center gap-5 text-[#6B6560] mb-4">
            <div className="flex items-center gap-1.5">
              <Maximize className="w-3.5 h-3.5" />
              <span className="text-sm">{property.m2} m²</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5" />
              <span className="text-sm">{property.beds} hab.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-3.5 h-3.5" />
              <span className="text-sm">{property.baths} baños</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p
              className="text-lg font-light text-[#2C2C2C] tracking-wide"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {property.price}
            </p>
            <span
              className="text-[11px] tracking-[0.12em] uppercase text-[#B8A07E] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              VER DETALLE →
            </span>
          </div>

          <div className="mt-4 h-px bg-gradient-to-r from-[#B8A07E]/40 to-transparent w-0 group-hover:w-full transition-all duration-700" />
        </div>
      </article>
    </Link>
  );
}
