import { useState } from "react";

const videos = [
  "/videos/video-home-001.mp4",
  "/videos/video-home-002.mp4",
  "/videos/video-home-003.mp4",
];

export default function HeroCarousel() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        key={videos[activeVideoIndex]}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videos[activeVideoIndex]} type="video/mp4" />
      </video>

      {/* Malla semitransparente / Overlay oscura */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Hero Content original */}
      <div className="absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-1000">
        <div className="text-center px-6 max-w-3xl">
          <h1
            className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-light leading-tight tracking-wide mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Gestión inmobiliaria boutique en Madrid.
            <br />
            <span className="text-[#D4C5A9]">Discreción. Criterio. Resultados.</span>
          </h1>
          <div className="gold-line mb-6 mx-auto" />
          <p
            className="text-white/85 text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
          >
            Acompañamiento integral en compra, venta y alquiler de activos residenciales prime, con enfoque estratégico, legal y financiero.
          </p>
        </div>
      </div>

      {/* UI Selection for the Client (Selector de vídeos) */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 bg-black/60 p-5 rounded-xl backdrop-blur-md border border-white/20 shadow-2xl">
        <span className="text-white/90 text-xs font-semibold uppercase tracking-widest">
          Selección de Video (Vista Clienta)
        </span>
        <div className="flex gap-3">
          {videos.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveVideoIndex(i)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
                activeVideoIndex === i
                  ? "bg-[#B8A07E] text-white shadow-lg scale-105"
                  : "bg-white/10 text-white/80 hover:bg-white/30"
              }`}
            >
              Opción {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
        <span
          className="text-white/50 text-[10px] tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          DESCUBRIR
        </span>
        <div className="w-px h-6 bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  );
}
