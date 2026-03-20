import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import OpenAI from "openai";

import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";

// Almacén temporal de imágenes por usuario
const userPendingImages: Record<number, string[]> = {};




const { TELEGRAM_BOT_TOKEN, OPENAI_API_KEY, API_TOKEN, PORT } = process.env;

export function initBot() {
  if (!TELEGRAM_BOT_TOKEN || !OPENAI_API_KEY) {
    console.warn("⚠️ Telegram Bot Token or OpenAI API Key missing. Bot won't start.");
    return;
  }

  const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  const apiUrl = `http://127.0.0.1:${PORT || 3000}/api/properties`;

  bot.start((ctx) => {
    ctx.reply("👋 ¡Hola! Soy el agente conversacional de IBERCORP. Envíame un mensaje de voz o texto para añadir, modificar o eliminar propiedades.");
  });

  bot.on(message("voice"), async (ctx) => {
    try {
      const msgMessage = await ctx.reply("🎙️ Audio recibido. Transcribiendo...");
      const fileId = ctx.message.voice.file_id;
      const fileLink = await ctx.telegram.getFileLink(fileId);
      
      // We need to fetch the file and pass it to OpenAI
      const response = await fetch(fileLink.toString());
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // OpenAI expects a file, we can use a temporary file or a custom File object
      const tempFilePath = path.join(process.cwd(), `temp_${Date.now()}.ogg`);
      fs.writeFileSync(tempFilePath, buffer);

      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: "whisper-1",
      });

      fs.unlinkSync(tempFilePath); // Cleanup

      await processTextForProperty(ctx, transcription.text, msgMessage.message_id);
    } catch (e) {
      console.error(e);
      ctx.reply("❌ Hubo un error procesando el audio.");
    }
  });

  bot.on(message("text"), async (ctx) => {
    try {
      const msgMessage = await ctx.reply("📝 Texto recibido. Procesando...");
      await processTextForProperty(ctx, ctx.message.text, msgMessage.message_id);
    } catch (e) {
      console.error(e);
      ctx.reply("❌ Hubo un error procesando el texto.");
    }
  });

  bot.on(message("photo"), async (ctx) => {
    try {
      // Telegram sends multiple sizes, get the last one (highest quality)
      const photo = ctx.message.photo.pop();
      if (!photo) return;
      
      const fileLink = await ctx.telegram.getFileLink(photo.file_id);
      
      // Axios works better for binary downloads
      const response = await axios({
        url: fileLink.toString(),
        method: 'GET',
        responseType: 'arraybuffer'
      });
      
      const tempFilePath = path.join(process.cwd(), `temp_${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`);
      fs.writeFileSync(tempFilePath, response.data);
      
      if (!userPendingImages[ctx.from.id]) {
        userPendingImages[ctx.from.id] = [];
      }
      userPendingImages[ctx.from.id].push(tempFilePath);
      
      ctx.reply(`📸 Imagen ${userPendingImages[ctx.from.id].length} guardada en memoria. Sigue subiendo fotos o envía el texto/audio con los detalles.`);
      
      // Procesar texto si viene incluido como pie de foto (caption)
      if (ctx.message.caption) {
        const msgMessage = await ctx.reply("📝 Texto adjunto a la foto recibido. Procesando...");
        await processTextForProperty(ctx, ctx.message.caption, msgMessage.message_id);
      }
    } catch (e) {
      console.error(e);
      ctx.reply("❌ Hubo un error procesando la imagen.");
    }
  });

  async function processTextForProperty(ctx: any, text: string, msgId: number) {
    try {
      await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, "🧠 Analizando la información con IA...");

      const systemPrompt = `
      Eres un asistente inmobiliario experto de la empresa Ibercorp.
      Extrae los siguientes datos del texto y devuélvelos en formato JSON estructurado:
      {
        "action": "create" | "update" | "delete",
        "reference": "string (ID, Referencia o TÍTULO de la propiedad a modificar/borrar)",
        "property": {
          "title": "string (OBLIGATORIO para 'create'. Genera uno atractivo si falta)",
          ...
        }
      }
      Reglas críticas para 'update' y 'delete':
      1. El campo 'reference' es VITAL. Pon ahí lo que el usuario use para identificar el piso (ej: el título exacto, la dirección, o la referencia técnica). Si dice 'López de Hoyos', pon 'López de Hoyos' en 'reference'.
      2. No devuelvas 'reference' vacío si el usuario ha nombrado el piso de alguna forma.
      3. Devuelve SOLO el JSON, sin markdown.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text }
        ],
      });

      let jsonStr = completion.choices[0].message.content?.trim() || "{}";
      if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
      }

      const orderData = JSON.parse(jsonStr);

      await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, "⚡ Ejecutando operación en la base de datos...");

      if (orderData.action === "create") {
        if (!orderData.property.id && !orderData.property.reference) {
             orderData.property.id = "prop-" + Date.now();
             orderData.property.reference = "REF-" + Math.floor(Math.random() * 10000);
        } else if (orderData.property.reference) {
             orderData.property.id = orderData.property.reference.toLowerCase().replace(/ /g, '-');
        }
        
        const formData = new FormData();
        formData.append('data', JSON.stringify(orderData.property));
        
        // Añadir imágenes pendientes
        const images = userPendingImages[ctx.from.id] || [];
        for (const imgPath of images) {
          formData.append('images', fs.createReadStream(imgPath));
        }

        try {
          const res = await axios.post(apiUrl, formData, {
            headers: {
              'Authorization': `Bearer ${API_TOKEN}`,
              ...formData.getHeaders()
            }
          });
          
          // Limpiar imágenes tras éxito
          delete userPendingImages[ctx.from.id];
          for (const imgPath of images) {
             if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
          }

          await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `✅ ¡Operación exitosa!\nPropiedad creada: ${orderData.property.title}\nRef: ${orderData.property.reference}`);
        } catch (err: any) {
           await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `❌ Fallo en la API al crear: ${err.response?.statusText || err.message}`);
        }
      } else if (orderData.action === "update") {
         try {
           // Primero buscamos la propiedad para obtener su ID real
           const allPropsRes = await axios.get(apiUrl);
           const allProps = allPropsRes.data;
           
           // Normalización para búsqueda flexible
           const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
           const searchQuery = normalize(orderData.reference);
           
           const found = allProps.find((p: any) => {
             const pId = normalize(p.id || "");
             const pRef = normalize(p.reference || "");
             const pTitle = normalize(p.title || "");
             
             return pId.includes(searchQuery) || 
                    pRef.includes(searchQuery) || 
                    pTitle.includes(searchQuery) ||
                    searchQuery.includes(pRef) && pRef.length > 2;
           });

           if (!found) {
             await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `❌ No se encontró ninguna propiedad que coincida con "${orderData.reference}".`);
             return;
           }

           const formData = new FormData();
           formData.append('data', JSON.stringify(orderData.property));
           
           const images = userPendingImages[ctx.from.id] || [];
           for (const imgPath of images) {
             formData.append('images', fs.createReadStream(imgPath));
           }

           const res = await axios.put(`${apiUrl}/${found.id}`, formData, {
             headers: {
               'Authorization': `Bearer ${API_TOKEN}`,
               ...formData.getHeaders()
             }
           });
           
           delete userPendingImages[ctx.from.id];
           for (const imgPath of images) {
              if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
           }

           await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `✅ ¡Propiedad "${found.title}" actualizada con éxito!`);
         } catch (err: any) {
           console.error(err);
           await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `❌ Fallo al actualizar la propiedad: ${err.response?.statusText || err.message}`);
         }
      } else if (orderData.action === "delete") {
         try {
            // Primero buscamos la propiedad para obtener su ID real
            const allPropsRes = await axios.get(apiUrl);
            const allProps = allPropsRes.data;
            
            // Normalización para búsqueda flexible
            const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
            const searchQuery = normalize(orderData.reference);
            
            const found = allProps.find((p: any) => {
              const pId = normalize(p.id || "");
              const pRef = normalize(p.reference || "");
              const pTitle = normalize(p.title || "");
              
              return pId.includes(searchQuery) || 
                     pRef.includes(searchQuery) || 
                     pTitle.includes(searchQuery) ||
                     searchQuery.includes(pRef) && pRef.length > 2;
            });

           if (!found) {
             await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `❌ No se pudo eliminar: No se encontró la propiedad "${orderData.reference}".`);
             return;
           }

           const res = await fetch(`${apiUrl}/${found.id}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${API_TOKEN}`
              }
           });

           if (res.ok) {
             await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `✅ Propiedad "${found.title}" eliminada del catálogo.`);
           } else {
             await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `❌ No se pudo eliminar la propiedad: ${res.statusText}`);
           }
         } catch (err: any) {
           console.error(err);
           await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `❌ Error al intentar eliminar: ${err.message}`);
         }
      } else {
         await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `❓ Acción no reconocida: ${orderData.action}`);
      }
      
    } catch (e) {
      console.error(e);
      ctx.telegram.editMessageText(ctx.chat.id, msgId, null, "❌ Hubo un error de conexión con los sistemas o falla de IA.");
    }
  }

  bot.launch().then(() => console.log("🤖 Telegram Bot running")).catch(console.error);

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
