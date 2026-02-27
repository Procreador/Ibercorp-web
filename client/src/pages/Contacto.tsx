import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Crear mailto con los datos del formulario
    const subject = encodeURIComponent('Consulta desde web IBERCORP');
    const body = encodeURIComponent(
      `Nombre: ${formData.nombre}\n` +
      `Email: ${formData.email}\n` +
      `Teléfono: ${formData.telefono}\n\n` +
      `Mensaje:\n${formData.mensaje}`
    );
    
    window.location.href = `mailto:info@ibercorp.com?subject=${subject}&body=${body}`;
    
    toast.success("Abriendo su cliente de correo...");
    setFormData({ nombre: "", email: "", telefono: "", mensaje: "" });
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="py-16 md:py-24 px-6 md:px-12 text-center bg-[#FAFAF7]">
        <span
          className="text-[11px] tracking-[0.2em] text-[#B8A07E] uppercase block mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          HABLEMOS
        </span>
        <h1
          className="text-3xl md:text-5xl font-light text-[#2C2C2C] tracking-wide mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Contacto
        </h1>
        <div className="gold-line" />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#B8A07E]/30 to-transparent" />

      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16">
          <div>
            <h2
              className="text-2xl font-light text-[#2C2C2C] mb-6 tracking-wide"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Estamos a su disposición
            </h2>
            <p
              className="text-[#6B6560] text-base leading-[1.85] mb-10"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              Para consultas sobre propiedades, operaciones off-market o cualquier servicio inmobiliario, 
              no dude en ponerse en contacto con nosotros. Le atenderemos con la máxima discreción y profesionalidad.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-[#FAFAF7] border border-[#E8E4DE] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[#B8A07E]" />
                </div>
                <div>
                  <p
                    className="text-[10px] tracking-[0.15em] uppercase text-[#8A8A8A] mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    UBICACIÓN
                  </p>
                  <p className="text-sm text-[#2C2C2C]" style={{ fontFamily: "var(--font-body)" }}>
                    Almagro, 2<br />28010 Madrid
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-[#FAFAF7] border border-[#E8E4DE] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-[#B8A07E]" />
                </div>
                <div>
                  <p
                    className="text-[10px] tracking-[0.15em] uppercase text-[#8A8A8A] mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    EMAIL
                  </p>
                  <a href="mailto:info@ibercorp.com" className="text-sm text-[#2C2C2C] hover:text-[#B8A07E] transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                    info@ibercorp.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-[#FAFAF7] border border-[#E8E4DE] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-[#B8A07E]" />
                </div>
                <div>
                  <p
                    className="text-[10px] tracking-[0.15em] uppercase text-[#8A8A8A] mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    TELÉFONO
                  </p>
                  <a href="tel:+34687493545" className="text-sm text-[#2C2C2C] hover:text-[#B8A07E] transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                    +34 687 493 545
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FAFAF7] border border-[#E8E4DE] p-8 md:p-10 rounded-sm">
            <h3
              className="text-xs tracking-[0.15em] uppercase text-[#B8A07E] mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              ENVÍENOS UN MENSAJE
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  className="block text-[10px] tracking-[0.12em] uppercase text-[#8A8A8A] mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  NOMBRE *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[#E8E4DE] text-sm text-[#2C2C2C] focus:border-[#B8A07E] focus:outline-none transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    className="block text-[10px] tracking-[0.12em] uppercase text-[#8A8A8A] mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-[#E8E4DE] text-sm text-[#2C2C2C] focus:border-[#B8A07E] focus:outline-none transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </div>
                <div>
                  <label
                    className="block text-[10px] tracking-[0.12em] uppercase text-[#8A8A8A] mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    TELÉFONO
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-[#E8E4DE] text-sm text-[#2C2C2C] focus:border-[#B8A07E] focus:outline-none transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-[10px] tracking-[0.12em] uppercase text-[#8A8A8A] mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  MENSAJE *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[#E8E4DE] text-sm text-[#2C2C2C] focus:border-[#B8A07E] focus:outline-none transition-colors resize-none"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3.5 bg-[#2C2C2C] text-white text-[12px] tracking-[0.15em] uppercase hover:bg-[#1A1A1A] transition-colors duration-300"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                ENVIAR MENSAJE
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
