import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { LOGO_URL, LOGO_WHITE_URL } from "@/lib/properties";
import { Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  {
    label: "PROPIEDADES",
    href: "/propiedades",
    dropdown: [
      { label: "MADRID (CAPITAL)", href: "/propiedades?zona=madrid-capital", separator: false, bold: true },
      { label: "ALMAGRO", href: "/propiedades?zona=almagro", separator: false, bold: false },
      { label: "BARRIO DE SALAMANCA", href: "/propiedades?zona=salamanca", separator: false, bold: false },
      { label: "JERÓNIMOS", href: "/propiedades?zona=jeronimos", separator: false, bold: false },
      { label: "JUSTICIA", href: "/propiedades?zona=justicia", separator: true, bold: false },
      { label: "ÁREAS RESIDENCIALES", href: "/propiedades?zona=areas-residenciales", separator: false, bold: true },
      { label: "LA MORALEJA", href: "/propiedades?zona=la-moraleja", separator: false, bold: false },
      { label: "POZUELO DE ALARCÓN", href: "/propiedades?zona=pozuelo", separator: true, bold: false },
      { label: "ZONAS COSTERAS", href: "/propiedades?zona=zonas-costeras", separator: false, bold: true },
      { label: "OTRAS ZONAS", href: "/propiedades?zona=otras-zonas", separator: false, bold: true },
      { label: "PROPIEDADES SINGULARES", href: "/propiedades?zona=singulares", separator: false, bold: true },
    ],
  },
  { label: "NOSOTROS", href: "/nosotros" },
  { label: "CONTACTO", href: "/contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [location] = useLocation();
  const isHome = location === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const isTransparent = !scrolled && isHome;
  const navBg = isTransparent
    ? "bg-transparent"
    : "bg-white/95 backdrop-blur-md shadow-sm";

  const textColor = isTransparent ? "text-white" : "text-[#2C2C2C]";
  const currentLogo = isTransparent ? LOGO_WHITE_URL : LOGO_URL;

  const handleDropdownItemClick = () => {
    setDropdownOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <img
              src={currentLogo}
              alt="Ibercorp"
              className="h-11 w-auto transition-all duration-300"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`nav-link flex items-center gap-1.5 py-2 ${textColor} cursor-pointer bg-transparent border-none outline-none`}
                  >
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5 opacity-60 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-0 w-full h-3" />
                  {dropdownOpen && (
                    <div className="absolute top-[calc(100%+12px)] left-0 z-50">
                      <div className="bg-white rounded-lg shadow-xl border border-gray-100 min-w-[260px] py-2 overflow-hidden">
                        {link.dropdown.map((item, i) => (
                          <div key={i}>
                            <a
                              href={item.href}
                              onClick={handleDropdownItemClick}
                              className={`block px-5 py-2.5 text-[12px] tracking-[0.1em] text-[#2C2C2C] hover:bg-[#FAFAF7] hover:text-[#B8A07E] transition-colors ${item.bold ? 'font-semibold' : ''}`}
                              style={{ fontFamily: "var(--font-heading)" }}
                            >
                              {item.label}
                            </a>
                            {item.separator && (
                              <div className="mx-4 my-1 border-t border-gray-100" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`nav-link py-2 ${textColor}`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <button
            className={`lg:hidden p-2 ${textColor}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-white transition-transform duration-500 lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pt-24 px-8 flex flex-col gap-6">
          {navLinks.map((link) => (
            <div key={link.label}>
              <Link
                href={link.href}
                className="nav-link text-[#2C2C2C] text-lg py-2 block"
              >
                {link.label}
              </Link>
              {link.dropdown && (
                <div className="pl-4 mt-2 flex flex-col gap-2 border-l border-[#B8A07E]/30">
                  {link.dropdown.map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      className={`text-[11px] tracking-[0.1em] text-[#6B6560] hover:text-[#B8A07E] transition-colors py-1 ${item.bold ? 'font-semibold' : ''}`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
