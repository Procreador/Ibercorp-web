import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import OpenAI from "openai";

import fs from "fs";
import path from "path";
import os from "os";
import axios from "axios";
import FormData from "form-data";
import { v4 as uuidv4 } from "uuid";

// Almacén temporal de imágenes por usuario
const userPendingImages: Record<number, string[]> = {};
// Timers para debouncing de álbumes
const userTimers: Record<number, NodeJS.Timeout> = {};
// Buffer de texto/caption por usuario
const userPendingText: Record<number, string> = {};

const { TELEGRAM_BOT_TOKEN, OPENAI_API_KEY, API_TOKEN, PORT } = process.env;

export function initBot() {
  console.log("🚀 [Bot] Invocando initBot()...");
  console.log("🚀 [Bot] Verificando variables de entorno:");
  console.log(`   - TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN ? '✅ Presente (' + TELEGRAM_BOT_TOKEN.substring(0, 5) + '...)' : '❌ Ausente'}`);
  console.log(`   - OPENAI_API_KEY: ${OPENAI_API_KEY ? '✅ Presente' : '❌ Ausente'}`);
  console.log(`   - API_TOKEN: ${API_TOKEN ? '✅ Presente (' + (API_TOKEN || '').substring(0, 5) + '...)' : '❌ Ausente'}`);
  console.log(`   - PORT: ${PORT || 'Default (3000)'}`);

  if (!TELEGRAM_BOT_TOKEN || !OPENAI_API_KEY) {
    console.warn("⚠️ [Bot] Faltan variables críticas. El bot no se iniciará.");
    return;
  }

  const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  const apiUrl = `http://127.0.0.1:${PORT || 3000}/api/properties`;

  bot.start((ctx) => {
    console.log(`👋 [Bot] /start recibido de @${ctx.from.username || ctx.from.id}`);
    ctx.reply("👋 ¡Hola! Soy el agente conversacional de IBERCORP. Envíame un mensaje de voz o texto para añadir, modificar o eliminar propiedades.");
  });

  bot.command("ping", (ctx) => {
    ctx.reply("pong 🏓 - Ibercorp Bot activo y operando.");
  });

  bot.on(message("voice"), async (ctx) => {
    try {
      const msgMessage = await ctx.reply("🎙️ Audio recibido. Transcribiendo...");
      const fileId = ctx.message.voice.file_id;
      const fileLink = await ctx.telegram.getFileLink(fileId);
      
      const response = await fetch(fileLink.toString());
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const tempFilePath = path.join(os.tmpdir(), `temp_${Date.now()}.ogg`);
      fs.writeFileSync(tempFilePath, buffer);

      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: "whisper-1",
      });

      try { fs.unlinkSync(tempFilePath); } catch (e) {} 

      await processTextForProperty(ctx, transcription.text, msgMessage.message_id);
    } catch (e) {
      console.error(e);
      ctx.reply("❌ Hubo un error procesando el audio.");
    }
  });

  bot.on(message("text"), async (ctx) => {
    try {
      const userId = ctx.from.id;
      const text = ctx.message.text;

      // Resetear timer de álbum si existiera
      if (userTimers[userId]) clearTimeout(userTimers[userId]);
      
      userPendingText[userId] = (userPendingText[userId] || "") + "\n" + text;

      userTimers[userId] = setTimeout(async () => {
        const fullText = userPendingText[userId].trim();
        delete userPendingText[userId];
        delete userTimers[userId];
        
        const msgMessage = await ctx.reply("📝 Procesando información...");
        await processTextForProperty(ctx, fullText, msgMessage.message_id);
      }, 1500); // Esperar 1.5s por si hay más mensajes o fotos

    } catch (e) {
      console.error(e);
      ctx.reply("❌ Hubo un error al recibir el texto.");
    }
  });

  bot.on(message("photo"), async (ctx) => {
    try {
      const userId = ctx.from.id;
      const photo = ctx.message.photo.pop();
      if (!photo) return;
      
      const fileLink = (await ctx.telegram.getFileLink(photo.file_id)).toString();
      
      // Guardar localmente en directorio temporal (Usando Buffer para mayor fiabilidad)
      const filePath = path.join(os.tmpdir(), `${Date.now()}-${uuidv4().slice(0, 8)}.jpg`);
      const response = await axios.get(fileLink, { responseType: 'arraybuffer' });
      fs.writeFileSync(filePath, Buffer.from(response.data));
      
      if (!userPendingImages[userId]) userPendingImages[userId] = [];
      userPendingImages[userId].push(filePath);
      
      // Manejar caption y debounce
      if (ctx.message.caption) {
        userPendingText[userId] = (userPendingText[userId] || "") + "\n" + ctx.message.caption;
      }

      if (userTimers[userId]) clearTimeout(userTimers[userId]);
      
      userTimers[userId] = setTimeout(async () => {
        const fullText = userPendingText[userId]?.trim();
        delete userPendingText[userId];
        delete userTimers[userId];

        if (fullText) {
          const msgMessage = await ctx.reply("📝 Procesando álbum y descripción...");
          await processTextForProperty(ctx, fullText, msgMessage.message_id);
        } else {
          ctx.reply("🖼️ Fotos guardadas. Ahora envía el texto o audio con los detalles para publicar.");
        }
      }, 2000); // 2 segundos de paciencia para álbumes

    } catch (e: any) {
      console.error("❌ [Bot Image Error]:", e.message, e.stack);
      ctx.reply(`❌ Error procesando imagen: ${e.message}`);
    }
  });

  async function processTextForProperty(ctx: any, text: string, msgId: number) {
    try {
      await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, "🧠 Analizando la información con IA...");

      const systemPrompt = `
      Eres un asistente inmobiliario experto de la empresa Ibercorp.
      Tu tarea es gestionar el catálogo de propiedades con precisión absoluta.
      
      Debes extraer los datos y devolver ÚNICAMENTE un JSON:
      {
        "action": "create" | "update" | "delete" | "query",
        "reference": "string (REFERENCIA limpia, ej: IC-7038)",
        "property": {
          "title": "string",
          "description": "string",
          "price": number,
          "sqm": number,
          "bedrooms": number,
          "bathrooms": number,
          "zone": "string (ID DE ZONA)",
          "type": "Venta" | "Alquiler",
          "reference": "string"
        }
      }

      REGLAS DE ORO:
      1. REFERENCIA: Si no se proporciona una, GENERA UNA ALEATORIA (Ej: IC-5421). **NUNCA uses "IC-XXXX"**.
      2. ZONAS (Usa estos IDs exactos en el campo 'zone'):
         - madrid-capital, almagro, salamanca, jeronimos, justicia, madrid-capital-otras
         - areas-residenciales, la-moraleja, pozuelo
         - zonas-costeras, otras-zonas, singulares
      3. ACCIÓN 'delete': Si el usuario dice 'borra' o 'elimina', extrae la referencia y pon action="delete".
      4. Normalización: Convierte "IC ochomil" a "IC-8000".
      5. FORMATO DE NÚMEROS: En el JSON, envía los números (price, sqm, etc.) como ENTEROS puros, sin puntos ni comas (Ej: 4600000, no 4.600.000).
      6. Responde SOLO con el JSON válido.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Contexto: Gestión Ibercorp.\nMensaje: ${text}` }
        ],
        response_format: { type: "json_object" }
      });

      const orderData = JSON.parse(completion.choices[0].message.content || "{}");
      
      // Normalización forzada en el bot
      if (orderData.action === "create" && !orderData.property.reference) {
        orderData.property.reference = "IC-" + Math.floor(1000 + Math.random() * 9000);
      }

      if (orderData.reference) {
        orderData.reference = orderData.reference.toUpperCase().replace(/\s/g, '');
      }
      if (orderData.property && orderData.property.reference) {
        orderData.property.reference = orderData.property.reference.toUpperCase().replace(/\s/g, '');
        const normalizeText = (text: string) => {
          if (!text) return "";
          return text
            .toString()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, "")
            .replace(/o/g, '0');
        };
        orderData.property.id = normalizeText(orderData.property.reference);
      }
      if (orderData.property && orderData.property.zone) {
        orderData.property.zone = orderData.property.zone.toLowerCase();
      }

      console.log("Comando IA Normalizado:", orderData);
      await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, "⚡ Ejecutando operación...");

      const normalizeForSearch = (s: string | undefined) => 
        (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, '');

      if (orderData.action === "create") {
        if (!orderData.property.id) {
           orderData.property.id = normalizeForSearch(orderData.property.reference);
        }
        
        const formData = new FormData();
        formData.append('data', JSON.stringify(orderData.property));
        
        const images = userPendingImages[ctx.from.id] || [];
        for (const imgPath of images) {
          formData.append('images', fs.createReadStream(imgPath));
        }

        try {
          await axios.post(apiUrl, formData, {
            headers: {
              'Authorization': `Bearer ${API_TOKEN}`,
              ...formData.getHeaders()
            }
          });
          
          // Cleanup
          for (const imgPath of images) {
            try { fs.unlinkSync(imgPath); } catch(e) {}
          }
          delete userPendingImages[ctx.from.id];
          
          await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `✅ ¡Publicado!\nPropiedad: ${orderData.property.title}\nRef: ${orderData.property.reference}`);
        } catch (err: any) {
          const apiError = err.response?.data?.error || err.message;
          const details = err.response?.data?.details || "";
          console.error("❌ [Bot Post Error]:", apiError, details);
          await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `❌ Error en el servidor al publicar.`);
        }
      } else if (orderData.action === "update" || orderData.action === "delete") {
         try {
           const axiosMethod = orderData.action === "delete" ? axios.delete : axios.put;
           const endpoint = `${apiUrl}/${orderData.reference}`;
           
           const formData = new FormData();
           if (orderData.action === "update") {
             formData.append('data', JSON.stringify(orderData.property));
             const images = userPendingImages[ctx.from.id] || [];
             for (const imgPath of images) {
               formData.append('images', fs.createReadStream(imgPath));
             }
           }

           await axios({
             method: orderData.action === "delete" ? 'delete' : 'put',
             url: endpoint,
             data: orderData.action === "update" ? formData : null,
             headers: { 
               'Authorization': `Bearer ${API_TOKEN}`,
               ...(orderData.action === "update" ? formData.getHeaders() : {})
             }
           });

           // Cleanup if update
           if (orderData.action === "update") {
             const images = userPendingImages[ctx.from.id] || [];
             for (const imgPath of images) {
               try { fs.unlinkSync(imgPath); } catch(e) {}
             }
             delete userPendingImages[ctx.from.id];
           }

           const verb = orderData.action === "delete" ? "Borrada" : "Actualizada";
           await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `✅ ${verb}: "${orderData.reference}".`);
         } catch (err: any) {
           await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `❌ No se pudo procesar la ${orderData.action}. Verifica que la referencia sea correcta.`);
         }
      } else if (orderData.action === "query") {
         try {
           const allPropsRes = await axios.get(apiUrl);
           const allProps = allPropsRes.data;
           const queryZone = orderData.property?.zone?.toLowerCase();
           
           const filtered = allProps.filter((p: any) => 
              !queryZone || p.zone?.toLowerCase().includes(queryZone)
           );

           if (filtered.length === 0) {
             await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `🧐 No hay nada en ${orderData.property?.zone || 'el catálogo'}.`);
           } else {
             let response = `🏘️ **Encontradas ${filtered.length}:**\n\n`;
             filtered.forEach((p: any, i: number) => {
               response += `${i+1}. **${p.title}**\n📍 ${p.zone} | Ref: ${p.reference}\n\n`;
             });
             await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, response, { parse_mode: 'Markdown' });
           }
         } catch (err: any) {
           await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `❌ Error al consultar.`);
         }
      }
      
    } catch (e) {
      console.error(e);
      ctx.telegram.editMessageText(ctx.chat.id, msgId, null, "❌ Error de sistemas.");
    }
  }

  bot.launch()
    .then(() => console.log("🤖 [Bot] Conexión establecida."))
    .catch((err) => console.error("❌ [Bot] Error:", err));

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
