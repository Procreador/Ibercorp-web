import { useState, useRef } from "react";
import { zones } from "@/lib/properties";

const PUBLISHABLE_ZONES = zones.filter(z => z.id !== "madrid-capital" && z.id !== "areas-residenciales");

const BADGE_OPTIONS = ["NUEVO", "PREMIUM", "REFORMADO", "CON GARAJE", "ÁTICO EXCLUSIVO", "CÉNTRICA", "OPORTUNIDAD", "EXCLUSIVA"];

function generateRef() {
  return "IC-" + Math.floor(1000 + Math.random() * 9000);
}

export default function AdminPublish() {
  const [form, setForm] = useState({
    title: "",
    address: "",
    zone: "",
    price: "",
    size: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
    badge: "NUEVO",
    reference: generateRef(),
  });
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [resultRef, setResultRef] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures(prev => [...prev, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (i: number) => setFeatures(prev => prev.filter((_, idx) => idx !== i));

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (i: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.zone || !form.address) {
      setErrorMsg("Por favor rellena al mínimo: Título, Dirección y Zona.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    const ref = form.reference || generateRef();
    const normalizeText = (text: string) =>
      text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "").replace(/o/g, "0");

    const propertyData = {
      id: normalizeText(ref),
      title: form.title,
      address: form.address,
      zone: form.zone,
      price: form.price,
      size: form.size ? parseInt(form.size) : null,
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
      description: form.description,
      features,
      badge: form.badge,
      reference: ref,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(propertyData));
    for (const img of images) {
      formData.append("images", img);
    }

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { Authorization: "Bearer ibercorp_dev_token_2024" },
        body: formData,
      });

      if (res.ok) {
        setResultRef(ref);
        setStatus("success");
        // Reset form
        setForm({
          title: "", address: "", zone: "", price: "", size: "",
          bedrooms: "", bathrooms: "", description: "", badge: "NUEVO",
          reference: generateRef(),
        });
        setFeatures([]);
        setImages([]);
        setPreviews([]);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Error desconocido del servidor.");
        setStatus("error");
      }
    } catch (err: any) {
      setErrorMsg("No se pudo conectar con el servidor: " + err.message);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="text-[10px] tracking-[0.4em] text-[#B8A07E] uppercase font-bold block mb-2">IBERCORP</span>
          <h1 className="text-3xl font-light tracking-[0.15em] text-[#2C2C2C] uppercase mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
            Panel de Gestión
          </h1>
          <div className="w-16 h-px bg-[#B8A07E] mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-light">Publica una nueva propiedad directamente en el catálogo.</p>
        </div>

        {/* Success Banner */}
        {status === "success" && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-green-800 font-medium text-lg">¡Propiedad publicada correctamente!</p>
            <p className="text-green-600 text-sm mt-1">Referencia asignada: <strong>{resultRef}</strong></p>
            <p className="text-green-500 text-xs mt-2">La propiedad ya aparece en la web. Puedes publicar otra a continuación.</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 space-y-6">
          
          {/* Referencia */}
          <div className="flex items-center gap-3 p-4 bg-[#FAF8F5] border border-[#E8DFD0] rounded-lg">
            <span className="text-[#B8A07E] text-sm font-medium">Referencia:</span>
            <span className="font-bold text-[#2C2C2C] tracking-widest">{form.reference}</span>
            <button type="button" onClick={() => setForm(p => ({ ...p, reference: generateRef() }))}
              className="ml-auto text-xs text-[#B8A07E] border border-[#B8A07E] px-3 py-1 rounded hover:bg-[#B8A07E] hover:text-white transition-all">
              Regenerar
            </button>
          </div>

          {/* Título */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Título de la propiedad *</label>
            <input name="title" value={form.title} onChange={handleChange} required
              placeholder="Ej: Piso de lujo en Barrio de Salamanca"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8A07E] transition-colors" />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Dirección *</label>
            <input name="address" value={form.address} onChange={handleChange} required
              placeholder="Ej: Calle Ayala 10, 3º Dcha. 28001 Madrid"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8A07E] transition-colors" />
          </div>

          {/* Zona y Badge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Zona *</label>
              <select name="zone" value={form.zone} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8A07E] transition-colors bg-white">
                <option value="">Selecciona zona...</option>
                {PUBLISHABLE_ZONES.map(z => (
                  <option key={z.id} value={z.id}>
                    {z.parent ? `↳ ${z.name}` : z.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Etiqueta / Badge</label>
              <select name="badge" value={form.badge} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8A07E] transition-colors bg-white">
                {BADGE_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          {/* Precio y m² */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Precio</label>
              <input name="price" value={form.price} onChange={handleChange}
                placeholder="Ej: 2.450.000 € o Precio a consultar"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8A07E] transition-colors" />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Superficie (m²)</label>
              <input name="size" value={form.size} onChange={handleChange} type="number" min="0"
                placeholder="Ej: 220"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8A07E] transition-colors" />
            </div>
          </div>

          {/* Habitaciones y Baños */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Habitaciones</label>
              <input name="bedrooms" value={form.bedrooms} onChange={handleChange} type="number" min="0"
                placeholder="Ej: 3"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8A07E] transition-colors" />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Baños</label>
              <input name="bathrooms" value={form.bathrooms} onChange={handleChange} type="number" min="0"
                placeholder="Ej: 2"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8A07E] transition-colors" />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Descripción</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={5}
              placeholder="Describe la propiedad con detalle..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8A07E] transition-colors resize-none" />
          </div>

          {/* Características */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
              Características destacadas
            </label>
            <div className="flex gap-2 mb-3">
              <input value={featureInput} onChange={e => setFeatureInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addFeature(); }}}
                placeholder="Ej: Techos altos originales (3.5m)"
                className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8A07E] transition-colors" />
              <button type="button" onClick={addFeature}
                className="px-4 py-3 bg-[#B8A07E] text-white text-sm rounded-lg hover:bg-[#9A8060] transition-colors">
                + Añadir
              </button>
            </div>
            {features.length > 0 && (
              <ul className="space-y-2">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center justify-between bg-[#FAF8F5] px-4 py-2 rounded-lg text-sm">
                    <span className="text-gray-700">✓ {f}</span>
                    <button type="button" onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-600 text-xs ml-4">
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Imágenes */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
              Fotografías
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#B8A07E] transition-colors">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-gray-500 text-sm">Haz clic para seleccionar fotos</p>
              <p className="text-gray-400 text-xs mt-1">JPG, PNG o WEBP — Puedes seleccionar varias a la vez</p>
              <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImages} />
            </div>
            {previews.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative group aspect-square">
                    <img src={src} alt="" className="w-full h-full object-cover rounded-lg" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              ❌ {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={status === "loading"}
            className="w-full py-4 bg-[#2C2C2C] text-white text-sm tracking-[0.2em] uppercase rounded-lg hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {status === "loading" ? "Publicando propiedad..." : "✦ Publicar en el catálogo"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Ibercorp · Panel de administración privado
        </p>
      </div>
    </div>
  );
}
