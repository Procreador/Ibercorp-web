import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="h-px bg-gradient-to-r from-transparent via-[#B8A07E] to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3
              className="text-2xl font-light tracking-[0.08em] mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              IBERCORP
            </h3>
            <p
              className="text-[#8A8A8A] text-sm leading-relaxed max-w-xs"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Gestión inmobiliaria discreta, criterio patrimonial y acceso a cartera privada en las mejores ubicaciones de Madrid.
            </p>
          </div>

          <div>
            <h4
              className="text-xs tracking-[0.15em] uppercase text-[#B8A07E] mb-5"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              NAVEGACIÓN
            </h4>
            <div className="flex flex-col gap-3">
              <Link href="/propiedades" className="text-sm text-[#8A8A8A] hover:text-white transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                Propiedades
              </Link>
              <Link href="/nosotros" className="text-sm text-[#8A8A8A] hover:text-white transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                Nosotros
              </Link>
              <Link href="/contacto" className="text-sm text-[#8A8A8A] hover:text-white transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                Contacto
              </Link>
            </div>
          </div>

          <div>
            <h4
              className="text-xs tracking-[0.15em] uppercase text-[#B8A07E] mb-5"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              CONTACTO
            </h4>
            <div className="flex flex-col gap-3 text-sm text-[#8A8A8A]" style={{ fontFamily: "var(--font-body)" }}>
              <p>Madrid, España</p>
              <Link href="/contacto" className="hover:text-white transition-colors">
                Solicitar información
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-[#666] tracking-wide" style={{ fontFamily: "var(--font-heading)" }}>
            © {new Date().getFullYear()} IBERCORP · Gestión de Propiedades
          </p>
        </div>
      </div>
    </footer>
  );
}
