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
      Tu tarea es gestionar el catálogo de propiedades a través de lenguaje natural (voz o texto).
      
      Debes extraer los siguientes datos y devolver ÚNICAMENTE un JSON:
      {
        "action": "create" | "update" | "delete",
        "reference": "string (La referencia, ID, o fragmento del título que el usuario use para identificar el piso)",
        "property": {
          "title": "string (Atractivo y profesional)",
          "description": "string (Crea una descripción seductora basada en los datos)",
          "price": number,
          "sqm": number,
          "bedrooms": number,
          "bathrooms": number,
          "zone": "string (Ej: almagro, jeronimos, salamanca, la-moraleja...)",
          "type": "Venta" | "Alquiler",
          "reference": "string (La referencia oficial si se menciona)"
        }
      }

      REGLAS DE ORO:
      1. Para 'delete' o 'update', pon en 'reference' EXACTAMENTE lo que diga el usuario (ej: "Ref-123", "Piso de Velázquez", "Velázquez 45").
      2. Para 'create', si faltan datos, usa tu conocimiento para que el anuncio quede "bonito".
      3. Si el usuario dice "elimina", "borra", "quita", la acción es 'delete'.
      4. Si el usuario describe un piso nuevo, la acción es 'create'.
      5. Responde SOLO con el JSON. No añadas explicaciones.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Contexto: Gestión de catálogo Ibercorp.\nMensaje del usuario: ${text}` }
        ],
        response_format: { type: "json_object" }
      });

      const orderData = JSON.parse(completion.choices[0].message.content || "{}");

      // Log para debug
      console.log("Comando IA:", orderData);

      await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, "⚡ Ejecutando operación...");

      const normalize = (s: string | undefined) => 
        (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, '');

      if (orderData.action === "create") {
        // Generación de IDs si no existen
        if (!orderData.property.reference) {
          orderData.property.reference = "IC-" + Math.floor(1000 + Math.random() * 9000);
        }
        orderData.property.id = normalize(orderData.property.reference);
        
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
          
          delete userPendingImages[ctx.from.id];
          await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `✅ ¡Publicado!\nPropiedad: ${orderData.property.title}\nRef: ${orderData.property.reference}`);
        } catch (err: any) {
          await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `❌ Error en el servidor al publicar.`);
        }
      } else if (orderData.action === "update" || orderData.action === "delete") {
         try {
            const allPropsRes = await axios.get(apiUrl);
            const allProps = allPropsRes.data;
            
            const query = normalize(orderData.reference);
            
            const found = allProps.find((p: any) => {
              const pId = normalize(p.id);
              const pRef = normalize(p.reference);
              const pTitle = normalize(p.title);
              
              // Coincidencia más agresiva
              return pId.includes(query) || pRef.includes(query) || pTitle.includes(query) || query.includes(pRef);
            });

            if (!found) {
              await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `❌ No he encontrado ninguna propiedad que se llame o tenga la referencia "${orderData.reference}".`);
              return;
            }

            if (orderData.action === "delete") {
              await axios.delete(`${apiUrl}/${found.id}`, {
                headers: { 'Authorization': `Bearer ${API_TOKEN}` }
              });
              await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `✅ Propiedad "${found.title}" (Ref: ${found.reference}) eliminada.`);
            } else {
              // Action: Update
              const formData = new FormData();
              formData.append('data', JSON.stringify({ ...found, ...orderData.property }));
              
              const images = userPendingImages[ctx.from.id] || [];
              for (const imgPath of images) {
                formData.append('images', fs.createReadStream(imgPath));
              }

              await axios.put(`${apiUrl}/${found.id}`, formData, {
                headers: {
                  'Authorization': `Bearer ${API_TOKEN}`,
                  ...formData.getHeaders()
                }
              });
              
              delete userPendingImages[ctx.from.id];
              await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `✅ Propiedad "${found.title}" actualizada correctamente.`);
            }
         } catch (err: any) {
           await ctx.telegram.editMessageText(ctx.chat.id, msgId, null, `❌ Error al procesar ${orderData.action}.`);
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
