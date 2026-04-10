export default function HeroCarousel() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/video_compi_noteequivoques.mp4" type="video/mp4" />
      </video>

      {/* Malla semitransparente / Overlay oscura */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center px-6 max-w-4xl">
          <h1
            className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-light leading-[1.2] tracking-wide mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Gestión Privada <br className="hidden sm:block" />
            de Activos Residenciales
          </h1>
          <div className="gold-line mb-8 mx-auto w-24 h-[1px] bg-[#B8A07E]" />
          <p
            className="text-white/95 text-lg sm:text-xl md:text-2xl font-light tracking-[0.1em]"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
          >
            Discreción. Criterio. Resultados
          </p>
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
