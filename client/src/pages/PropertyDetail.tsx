import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { properties } from "@/lib/properties";
import { MapPin, Maximize, BedDouble, Bath, Calendar, ChevronLeft, ChevronRight, X, ArrowLeft } from "lucide-react";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const property = properties.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="text-2xl text-[#2C2C2C]" style={{ fontFamily: "var(--font-display)" }}>
          Propiedad no encontrada
        </h1>
        <Link href="/propiedades" className="mt-4 inline-block text-[#B8A07E]">
          Volver a propiedades
        </Link>
      </div>
    );
  }

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % property.images.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + property.images.length) % property.images.length);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6">
        <Link
          href="/propiedades"
          className="inline-flex items-center gap-2 text-[12px] tracking-[0.12em] uppercase text-[#6B6560] hover:text-[#B8A07E] transition-colors"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          VOLVER A PROPIEDADES
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.4fr] gap-3">
          <div
            className="relative aspect-[16/10] overflow-hidden rounded-sm cursor-pointer group"
            onClick={() => setLightboxOpen(true)}
          >
            <img
              src={property.images[selectedImage]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            <div
              className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm text-[11px] tracking-[0.1em] uppercase text-[#2C2C2C] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              VER GALERÍA ({property.images.length} FOTOS)
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
            {property.images.slice(0, 6).map((img, i) => (
              <div
                key={i}
                className={`aspect-square overflow-hidden rounded-sm cursor-pointer transition-all duration-300 ${
                  i === selectedImage ? "ring-2 ring-[#B8A07E] opacity-100" : "opacity-70 hover:opacity-100"
                }`}
                onClick={() => setSelectedImage(i)}
              >
                <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex lg:hidden gap-2 mt-3 overflow-x-auto pb-2">
          {property.images.map((img, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-16 h-16 overflow-hidden rounded-sm cursor-pointer transition-all duration-300 ${
                i === selectedImage ? "ring-2 ring-[#B8A07E]" : "opacity-60"
              }`}
              onClick={() => setSelectedImage(i)}
            >
              <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span
                className="px-3 py-1 bg-[#FAFAF7] border border-[#E8E4DE] text-[10px] tracking-[0.15em] uppercase text-[#6B6560]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {property.tag}
              </span>
              <span
                className="text-[11px] tracking-[0.1em] text-[#8A8A8A]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {property.ref}
              </span>
            </div>

            <h1
              className="text-3xl md:text-4xl font-light text-[#2C2C2C] mb-4 tracking-wide"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {property.title}
            </h1>

            <div className="flex items-center gap-1.5 text-[#6B6560] mb-8">
              <MapPin className="w-4 h-4" />
              <span className="text-sm" style={{ fontFamily: "var(--font-body)" }}>
                {property.address}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {[
                { icon: Maximize, label: "SUPERFICIE", value: `${property.m2} m²` },
                { icon: BedDouble, label: "DORMITORIOS", value: `${property.beds}` },
                { icon: Bath, label: "BAÑOS", value: `${property.baths}` },
                { icon: Calendar, label: "AÑO", value: property.year },
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-[#FAFAF7] border border-[#E8E4DE] rounded-sm">
                  <stat.icon className="w-4 h-4 text-[#B8A07E] mb-2" />
                  <p
                    className="text-[9px] tracking-[0.15em] text-[#8A8A8A] uppercase mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {stat.label}
                  </p>
                  <p className="text-lg font-light text-[#2C2C2C]" style={{ fontFamily: "var(--font-display)" }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-10">
              <h3
                className="text-xs tracking-[0.15em] uppercase text-[#B8A07E] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                DESCRIPCIÓN
              </h3>
              <p
                className="text-[#6B6560] text-base leading-[1.85]"
                style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
              >
                {property.description}
              </p>
            </div>

            <div>
              <h3
                className="text-xs tracking-[0.15em] uppercase text-[#B8A07E] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                CARACTERÍSTICAS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 py-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#B8A07E]" />
                    <span className="text-sm text-[#6B6560]" style={{ fontFamily: "var(--font-body)" }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-28 h-fit">
            <div className="bg-[#FAFAF7] border border-[#E8E4DE] p-8 rounded-sm">
              <p
                className="text-2xl font-light text-[#2C2C2C] mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {property.price}
              </p>
              <div className="h-px bg-[#E8E4DE] my-6" />
              <p
                className="text-sm text-[#6B6560] leading-relaxed mb-8"
                style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
              >
                ¿Interesado en esta propiedad? Contacte con nuestro equipo para concertar una visita privada.
              </p>
              <a
                href={`https://wa.me/34687493545?text=${encodeURIComponent(`Hola, estoy interesado en la propiedad: ${property.title} (${property.address})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-6 py-3.5 bg-[#2C2C2C] text-white text-[12px] tracking-[0.15em] uppercase hover:bg-[#1A1A1A] transition-colors duration-300 mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                SOLICITAR INFORMACIÓN
              </a>
              <a
                href={`https://wa.me/34687493545?text=${encodeURIComponent(`Hola, me gustaría concertar una visita para: ${property.title} (${property.address})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-6 py-3.5 border border-[#2C2C2C] text-[#2C2C2C] text-[12px] tracking-[0.15em] uppercase hover:bg-[#2C2C2C] hover:text-white transition-all duration-300"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                CONCERTAR VISITA
              </a>
            </div>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={prevImage}
            className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <img
            src={property.images[selectedImage]}
            alt=""
            className="max-w-[90vw] max-h-[85vh] object-contain"
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm" style={{ fontFamily: "var(--font-heading)" }}>
            {selectedImage + 1} / {property.images.length}
          </div>
        </div>
      )}
    </div>
  );
}
