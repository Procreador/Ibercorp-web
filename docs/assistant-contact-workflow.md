# Contactos del asistente Ibercorp

Estado: pendiente de conectar el webhook real y la cuenta de correo en Make. No afirmar envío operativo hasta superar la prueba completa.

Destino fijo: luisa@ibercorp.com. El modelo no puede elegir otro destinatario.

## Flujo previsto

1. ElevenLabs recoge nombre, teléfono confirmado, consulta y permiso para contactar. El email del interesado es opcional.
2. `enviar_lead` exige `nombre_cliente`, `telefono_cliente`, `resumen_necesidad` y `acepta_contacto` (true).
3. Make recibe la petición autenticada. Valida nombre no vacío, teléfono plausible y consentimiento; rechaza campos mínimos ausentes.
4. Enviar correo mediante la conexión existente de Ibercorp, destinatario fijo Luisa. Asunto: «Nuevo contacto del asistente web — [nombre]». Cuerpo en texto plano: nombre, teléfono, email opcional, motivo, zona, operación, presupuesto y urgencia. No añadir valores no facilitados.
5. La respuesta al webhook va DESPUÉS del módulo de correo: HTTP 200 y `{"enviado":true}` únicamente cuando el proveedor acepte el correo. En error devolver 4xx/5xx; nunca aceptar por defecto ni ignorar el fallo del módulo de correo.
6. El asistente confirma envío solo con esa respuesta. En fallo ofrece luisa@ibercorp.com y explica que no pudo enviar. No vuelve a enviar automáticamente tras un timeout de resultado incierto.

## Pruebas necesarias

- Sin nombre o teléfono: pide el dato ausente, sin prometer aviso.
- Datos y consentimiento completos: correo técnico claramente marcado «PRUEBA TÉCNICA — no contactar», verificar ejecución real del módulo y aceptación del proveedor.
- Fallo del correo: no devuelve éxito ni promete contacto.
- Verificar conversación de producción, no solo simulación de herramientas.

## Publicación de imágenes

Antes de publicar el cambio del menú, asegurar un volumen persistente para `/app/data` y fotos. El despliegue anterior perdió la base SQLite efímera. Existe copia de los siete inmuebles y las 194 imágenes, pero no sustituye la persistencia del servicio.
