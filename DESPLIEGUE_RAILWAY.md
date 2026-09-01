# Despliegue de Ibercorp en Railway

La web pública, el panel, la API y el bot de Telegram forman una sola
aplicación. El dominio oficial `www.ibercorp.com` está asociado a este mismo
servicio de Railway.

## Variables obligatorias

- `ADMIN_PASSWORD`: clave larga y exclusiva para el panel.
- `SESSION_SECRET`: valor aleatorio de al menos 32 caracteres.
- `API_TOKEN`: token diferente para Telegram, Make y otras integraciones.
- `DATA_DIR=/data`: ruta del volumen persistente.
- `NODE_ENV=production`.

Las variables de Telegram, OpenAI y ElevenLabs que ya existan deben conservarse
sin cambios.

## Volumen persistente

El servicio necesita un volumen de Railway montado en `/data`. Dentro se
guardan `properties.db` y las fotografías subidas. Sin este volumen, los datos
se perderían al reconstruir o reiniciar el contenedor.

## Construcción y arranque

`railway.toml` contiene los comandos de instalación, compilación, arranque y
la comprobación de salud. Railway debe utilizar Node 22.

## Direcciones

- Web: `https://www.ibercorp.com`
- Propiedades: `https://www.ibercorp.com/propiedades`
- Panel: `https://www.ibercorp.com/gestion-ibercorp-2024`
- Salud: `https://www.ibercorp.com/api/health`

## Seguridad

No existe un endpoint público para generar tokens. Los valores de
`ADMIN_PASSWORD`, `SESSION_SECRET` y `API_TOKEN` se generan fuera de la
aplicación, se guardan únicamente en Railway y deben ser distintos entre sí.
Hay que rotar cualquier token que haya aparecido anteriormente en
documentación, archivos o conversaciones.
