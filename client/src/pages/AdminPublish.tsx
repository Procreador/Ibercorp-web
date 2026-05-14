import { useState, useRef, useEffect } from "react";
import { zones } from "@/lib/properties";

const PUBLISHABLE_ZONES = zones.filter(z => z.id !== "madrid-capital" && z.id !== "areas-residenciales");
const BADGE_OPTIONS = ["NUEVO", "PREMIUM", "REFORMADO", "CON GARAJE", "ÁTICO EXCLUSIVO", "CÉNTRICA", "OPORTUNIDAD", "EXCLUSIVA"];
const TOKEN = "ibercorp_dev_token_2024";

const genRef = () => "IC-" + Math.floor(1000 + Math.random() * 9000);
const normId = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,"").replace(/o/g,"0");
const emptyForm = () => ({ title:"", address:"", zone:"", price:"", size:"", bedrooms:"", bathrooms:"", description:"", badge:"NUEVO", reference: genRef() });

export default function AdminPublish() {
  const [props, setProps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm());
  const [features, setFeatures] = useState<string[]>([]);
  const [featInput, setFeatInput] = useState("");
  const [newImgs, setNewImgs] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [keepImgs, setKeepImgs] = useState<string[]>([]);
  const [editId, setEditId] = useState<string|null>(null);
  const [delConfirm, setDelConfirm] = useState<string|null>(null);
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [successRef, setSuccessRef] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const loadProps = async () => {
    setLoading(true);
    try { const r = await fetch("/api/properties"); setProps(await r.json()); } catch {}
    setLoading(false);
  };

  useEffect(() => { loadProps(); }, []);

  const fc = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const addFeat = () => { if (featInput.trim()) { setFeatures(p => [...p, featInput.trim()]); setFeatInput(""); } };

  const addImgs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImgs(p => [...p, ...files]);
    setNewPreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))]);
  };

  const startEdit = (p: any) => {
    setEditId(p.id);
    setForm({ title: p.title||"", address: p.address||"", zone: p.zone||"", price: p.price||"",
      size: p.size?.toString()||"", bedrooms: p.bedrooms?.toString()||"", bathrooms: p.bathrooms?.toString()||"",
      description: p.description||"", badge: p.badge||"NUEVO", reference: p.reference||genRef() });
    setFeatures(p.features||[]);
    setKeepImgs(p.images||[]);
    setNewImgs([]); setNewPreviews([]);
    setStatus("idle"); setErrMsg("");
    setTimeout(() => formRef.current?.scrollIntoView({ behavior:"smooth" }), 100);
  };

  const cancelEdit = () => {
    setEditId(null); setForm(emptyForm()); setFeatures([]);
    setKeepImgs([]); setNewImgs([]); setNewPreviews([]);
    setStatus("idle"); setErrMsg("");
  };

  const deleteProp = async (id: string) => {
    await fetch(`/api/properties/${id}`, { method:"DELETE", headers:{ Authorization:`Bearer ${TOKEN}` }});
    setDelConfirm(null); loadProps();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.zone || !form.address) { setErrMsg("Título, Dirección y Zona son obligatorios."); return; }
    setStatus("loading"); setErrMsg("");

    const ref = form.reference || genRef();
    const data: any = {
      title: form.title, address: form.address, zone: form.zone, price: form.price,
      size: form.size ? parseInt(form.size) : null,
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
      description: form.description, features, badge: form.badge, reference: ref,
    };
    if (!editId) data.id = normId(ref);
    if (editId) data.existingImages = keepImgs;

    const fd = new FormData();
    fd.append("data", JSON.stringify(data));
    for (const img of newImgs) fd.append("images", img);

    try {
      const res = await fetch(editId ? `/api/properties/${editId}` : "/api/properties", {
        method: editId ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: fd,
      });
      if (res.ok) {
        setSuccessRef(ref); setStatus("success");
        cancelEdit(); loadProps();
      } else {
        const err = await res.json();
        setErrMsg(err.error || "Error del servidor."); setStatus("error");
      }
    } catch (err: any) {
      setErrMsg("Error de conexión: " + err.message); setStatus("error");
    }
  };

  const zoneName = (id: string) => zones.find(z => z.id === id)?.name || id;

  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <span className="text-[10px] tracking-[0.4em] text-[#B8A07E] uppercase font-bold block mb-2">IBERCORP</span>
          <h1 className="text-3xl font-light tracking-[0.15em] text-[#2C2C2C] uppercase mb-2" style={{ fontFamily:"Playfair Display, serif" }}>
            Panel de Gestión
          </h1>
          <div className="w-16 h-px bg-[#B8A07E] mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-light">Publica y gestiona las propiedades del catálogo.</p>
        </div>

        {/* Property List */}
        <div className="mb-10">
          <h2 className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-4">Propiedades publicadas</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-400 text-sm">Cargando...</div>
          ) : props.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
              No hay propiedades aún. ¡Añade la primera!
            </div>
          ) : (
            <div className="space-y-3">
              {props.map(p => (
                <div key={p.id} className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm">
                  {p.images?.[0]
                    ? <img src={p.images[0]} alt="" className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    : <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl">🏠</div>}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#2C2C2C] text-sm truncate">{p.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{zoneName(p.zone)} · {p.reference}</p>
                    <p className="text-xs text-[#B8A07E] mt-0.5 font-medium">{p.price || "Precio no indicado"}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(p)}
                      className="px-3 py-2 text-xs border border-[#B8A07E] text-[#B8A07E] rounded-lg hover:bg-[#B8A07E] hover:text-white transition-all">
                      ✏️ Editar
                    </button>
                    {delConfirm === p.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => deleteProp(p.id)} className="px-3 py-2 text-xs bg-red-500 text-white rounded-lg">Borrar</button>
                        <button onClick={() => setDelConfirm(null)} className="px-3 py-2 text-xs border border-gray-200 text-gray-500 rounded-lg">No</button>
                      </div>
                    ) : (
                      <button onClick={() => setDelConfirm(p.id)} className="px-3 py-2 text-xs border border-red-200 text-red-400 rounded-lg hover:bg-red-50 transition-all">
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Success */}
        {status === "success" && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-green-800 font-medium">¡Operación completada! Ref: <strong>{successRef}</strong></p>
          </div>
        )}

        {/* Form */}
        <div ref={formRef}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs tracking-[0.3em] uppercase text-gray-500">
              {editId ? "✏️ Editando propiedad" : "Nueva propiedad"}
            </h2>
            {editId && (
              <button onClick={cancelEdit} className="text-xs text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all">
                ✕ Cancelar
              </button>
            )}
          </div>

          <form onSubmit={submit} className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 space-y-6">

            {/* Ref */}
            <div className="flex items-center gap-3 p-4 bg-[#FAF8F5] border border-[#E8DFD0] rounded-lg">
              <span className="text-[#B8A07E] text-sm font-medium">Referencia:</span>
              <span className="font-bold text-[#2C2C2C] tracking-widest">{form.reference}</span>
              {!editId && (
                <button type="button" onClick={() => setForm(p => ({...p, reference: genRef()}))}
                  className="ml-auto text-xs text-[#B8A07E] border border-[#B8A07E] px-3 py-1 rounded hover:bg-[#B8A07E] hover:text-white transition-all">
                  Regenerar
                </button>
              )}
            </div>

            {/* Titulo */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Título *</label>
              <input name="title" value={form.title} onChange={fc} required placeholder="Ej: Piso de lujo en Barrio de Salamanca"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8A07E] transition-colors" />
            </div>

            {/* Direccion */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Dirección *</label>
              <input name="address" value={form.address} onChange={fc} required placeholder="Ej: Calle Ayala 10, 3º Dcha. 28001 Madrid"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8A07E] transition-colors" />
            </div>

            {/* Zona + Badge */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Zona *</label>
                <select name="zone" value={form.zone} onChange={fc} required
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8A07E] bg-white transition-colors">
                  <option value="">Selecciona zona...</option>
                  {PUBLISHABLE_ZONES.map(z => <option key={z.id} value={z.id}>{z.parent ? `↳ ${z.name}` : z.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Etiqueta</label>
                <select name="badge" value={form.badge} onChange={fc}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8A07E] bg-white transition-colors">
                  {BADGE_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            {/* Precio + m2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Precio</label>
                <input name="price" value={form.price} onChange={fc} placeholder="Ej: 2.450.000 € o Precio a consultar"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8A07E] transition-colors" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Superficie (m²)</label>
                <input name="size" value={form.size} onChange={fc} type="number" min="0" placeholder="Ej: 220"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8A07E] transition-colors" />
              </div>
            </div>

            {/* Hab + Banos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Habitaciones</label>
                <input name="bedrooms" value={form.bedrooms} onChange={fc} type="number" min="0" placeholder="Ej: 3"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8A07E] transition-colors" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Baños</label>
                <input name="bathrooms" value={form.bathrooms} onChange={fc} type="number" min="0" placeholder="Ej: 2"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8A07E] transition-colors" />
              </div>
            </div>

            {/* Descripcion */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Descripción</label>
              <textarea name="description" value={form.description} onChange={fc} rows={5} placeholder="Describe la propiedad con detalle..."
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8A07E] transition-colors resize-none" />
            </div>

            {/* Caracteristicas */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Características</label>
              <div className="flex gap-2 mb-3">
                <input value={featInput} onChange={e => setFeatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addFeat(); }}}
                  placeholder="Ej: Techos altos originales"
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8A07E] transition-colors" />
                <button type="button" onClick={addFeat} className="px-4 py-3 bg-[#B8A07E] text-white text-sm rounded-lg hover:bg-[#9A8060] transition-colors">
                  + Añadir
                </button>
              </div>
              {features.length > 0 && (
                <ul className="space-y-2">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center justify-between bg-[#FAF8F5] px-4 py-2 rounded-lg text-sm">
                      <span className="text-gray-700">✓ {f}</span>
                      <button type="button" onClick={() => setFeatures(p => p.filter((_,j) => j !== i))}
                        className="text-red-400 hover:text-red-600 text-xs ml-4">Eliminar</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Fotos actuales (edit mode) */}
            {editId && keepImgs.length > 0 && (
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Fotos actuales</label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {keepImgs.map((src, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img src={src} alt="" className="w-full h-full object-cover rounded-lg" />
                      <button type="button" onClick={() => setKeepImgs(p => p.filter((_,j) => j !== i))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Pasa el ratón para eliminar una foto.</p>
              </div>
            )}

            {/* Nuevas fotos */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                {editId ? "Añadir nuevas fotos" : "Fotografías"}
              </label>
              <div onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#B8A07E] transition-colors">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-gray-500 text-sm">Haz clic para seleccionar fotos</p>
                <p className="text-gray-400 text-xs mt-1">JPG, PNG o WEBP — varias a la vez</p>
                <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={addImgs} />
              </div>
              {newPreviews.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                  {newPreviews.map((src, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img src={src} alt="" className="w-full h-full object-cover rounded-lg" />
                      <button type="button" onClick={() => { setNewImgs(p => p.filter((_,j) => j !== i)); setNewPreviews(p => p.filter((_,j) => j !== i)); }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {errMsg && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">❌ {errMsg}</div>}

            <button type="submit" disabled={status === "loading"}
              className="w-full py-4 bg-[#2C2C2C] text-white text-sm tracking-[0.2em] uppercase rounded-lg hover:bg-[#1a1a1a] transition-colors disabled:opacity-50">
              {status === "loading"
                ? (editId ? "Guardando cambios..." : "Publicando propiedad...")
                : (editId ? "✦ Guardar cambios" : "✦ Publicar en el catálogo")}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">Ibercorp · Panel de administración privado</p>
      </div>
    </div>
  );
}
