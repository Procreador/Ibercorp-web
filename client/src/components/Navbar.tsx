import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { LOGO_URL, LOGO_WHITE_URL } from "@/lib/properties";
import { Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "PROPIEDADES", href: "/propiedades" },
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
              className="h-16 w-auto transition-all duration-300 object-contain drop-shadow-sm"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`nav-link py-2 ${textColor}`}
              >
                {link.label}
              </Link>
            ))}
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
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
