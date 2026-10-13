import { Router } from "express";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const field = z.string().trim().max(1000).optional();
const leadSchema = z.object({
  nombre_cliente: z.string().trim().min(2).max(150),
  telefono_cliente: z.string().trim().max(30).refine(v => /^\+?[\d\s().-]+$/.test(v) && v.replace(/\D/g, "").length >= 9 && v.replace(/\D/g, "").length <= 15),
  resumen_necesidad: z.string().trim().min(5).max(3000),
  acepta_contacto: z.literal(true),
  email_cliente: z.union([z.email(), z.literal("")]).optional(),
  tipo_operacion: field, zona_interes: field, presupuesto: field,
  tipo_inmueble: field, urgencia: field,
});

export function createLeadsRouter(send: typeof fetch = fetch) {
  const router = Router();
  router.post("/", async (req, res) => {
    const secret = process.env.LEAD_WEBHOOK_SECRET;
    const supplied = req.get("authorization") || "";
    const expected = `Bearer ${secret}`;
    if (!secret || Buffer.byteLength(supplied) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) {
      res.status(401).json({ enviado: false }); return;
    }
    const parsed = leadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ enviado: false, error: "Faltan datos válidos o permiso de contacto", campos: parsed.error.issues.map(i => i.path.join(".")) }); return;
    }
    if (!process.env.RESEND_API_KEY || !process.env.LEAD_FROM_EMAIL) {
      res.status(503).json({ enviado: false, error: "Envío de correo pendiente de configuración" }); return;
    }
    const lead = parsed.data;
    const labels: Record<string, string> = {nombre_cliente:"Nombre", telefono_cliente:"Teléfono", email_cliente:"Email", resumen_necesidad:"Consulta", zona_interes:"Zona", tipo_operacion:"Operación", presupuesto:"Presupuesto", tipo_inmueble:"Tipo de inmueble", urgencia:"Urgencia"};
    const text = Object.entries(labels).map(([key, label]) => `${label}: ${lead[key as keyof typeof lead] || "No facilitado"}`).join("\n") + "\nPermiso para contactar: sí";
    const payload = { from: process.env.LEAD_FROM_EMAIL, to: ["luisa@ibercorp.com"], subject: "Nuevo contacto del asistente de Ibercorp", text };
    const idempotencyKey = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
    try {
      const result = await send("https://api.resend.com/emails", {
        method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `ibercorp-${idempotencyKey}` },
        body: JSON.stringify(payload), signal: AbortSignal.timeout(12000),
      });
      const receipt = await result.json() as { id?: string };
      if (!result.ok || !receipt.id) { res.status(502).json({ enviado: false, error: "El servicio de correo no ha confirmado el envío" }); return; }
      res.json({ enviado: true, id_envio: receipt.id });
    } catch {
      res.status(502).json({ enviado: false, error: "No se ha podido confirmar el envío" });
    }
  });
  return router;
}
export const router = createLeadsRouter();
