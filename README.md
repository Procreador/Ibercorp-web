# 🏢 IBERCORP - Sistema de Gestión de Propiedades con Automatización

Sistema completo de gestión de propiedades inmobiliarias con automatización mediante voz (Telegram + ElevenLabs) y API REST.

## 🎯 Características

- ✅ **Frontend React** con diseño moderno y responsive
- ✅ **Backend API REST** con Express.js
- ✅ **Base de Datos SQLite** con migraciones automáticas
- ✅ **Integración Telegram** para añadir propiedades con voz + fotos
- ✅ **Integración ElevenLabs** para gestión por voz en la web
- ✅ **Sistema de Autenticación** con tokens seguros
- ✅ **Upload de Imágenes** con validación y optimización
- ✅ **Documentación Completa** para todas las integraciones

## 🚀 Inicio Rápido

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/ibercorp-web.git
cd ibercorp-web

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus valores

# Migrar propiedades a la base de datos
pnpm run migrate

# Compilar para producción
pnpm run build

# Iniciar servidor
pnpm start
```

### Desarrollo

```bash
# Modo desarrollo con hot-reload
pnpm run dev
```

El sitio estará disponible en `http://localhost:3000`

## 📦 Despliegue en Producción

Elige una de estas opciones:

### Opción 1: Railway (Recomendado)

```bash
# Ver guía completa
cat DESPLIEGUE_RAILWAY.md
```

**Ventajas:**
- ✅ Sin cold starts
- ✅ Despliegue rápido (2-3 min)
- ✅ $5 USD gratis/mes

### Opción 2: Render

```bash
# Ver guía completa
cat DESPLIEGUE_RENDER.md
```

**Ventajas:**
- ✅ Plan gratuito generoso (750h/mes)
- ✅ SSL/TLS automático
- ⚠️ Cold starts después de 15 min

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [GUIA_RAPIDA_INICIO.md](./GUIA_RAPIDA_INICIO.md) | Guía rápida para empezar |
| [RESUMEN_IMPLEMENTACION.md](./RESUMEN_IMPLEMENTACION.md) | Documentación técnica completa |
| [INTEGRACION_TELEGRAM_MAKE.md](./INTEGRACION_TELEGRAM_MAKE.md) | Configurar Telegram + Make.com |
| [INTEGRACION_ELEVENLABS.md](./INTEGRACION_ELEVENLABS.md) | Configurar ElevenLabs ConvAI |
| [DESPLIEGUE_RAILWAY.md](./DESPLIEGUE_RAILWAY.md) | Desplegar en Railway |
| [DESPLIEGUE_RENDER.md](./DESPLIEGUE_RENDER.md) | Desplegar en Render |
| [SECURITY.md](./SECURITY.md) | Información de seguridad |

## 🔑 Variables de Entorno

Crea un archivo `.env` con:

```env
# Token de autenticación de la API
API_TOKEN=tu_token_seguro_aqui

# Entorno
NODE_ENV=production

# Puerto (opcional, por defecto 3000)
PORT=3000
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
pnpm run dev          # Inicia servidor de desarrollo

# Producción
pnpm run build        # Compila el proyecto
pnpm start            # Inicia servidor de producción

# Base de Datos
pnpm run migrate      # Migra propiedades a la base de datos

# Calidad de Código
pnpm run check        # Verifica tipos de TypeScript
pnpm run format       # Formatea el código con Prettier
```

## 📡 API Endpoints

### Públicos (sin autenticación)

```
GET  /api/health              # Health check
GET  /api/properties          # Listar propiedades
GET  /api/properties/:id      # Ver una propiedad
```

### Protegidos (requieren token)

```
POST   /api/properties           # Crear propiedad
PUT    /api/properties/:id       # Actualizar propiedad
DELETE /api/properties/:id       # Eliminar propiedad
POST   /api/properties/:id/images # Subir imágenes
```

### Ejemplo de Uso

```bash
# Crear una propiedad
curl -X POST https://tu-dominio.com/api/properties \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "nueva-propiedad",
    "title": "Piso en Salamanca",
    "address": "Calle Serrano 45",
    "zone": "salamanca",
    "price": "2.000.000 €",
    "size": 150,
    "bedrooms": 3,
    "bathrooms": 2
  }'
```

## 🎨 Zonas Disponibles

Al crear propiedades, usa una de estas zonas:

- `salamanca` - Barrio de Salamanca
- `almagro` - Almagro
- `jeronimos` - Jerónimos
- `justicia` - Justicia
- `la-moraleja` - La Moraleja
- `pozuelo` - Pozuelo de Alarcón
- `madrid-capital` - Madrid Capital
- `otras-zonas` - Otras Zonas
- `singulares` - Propiedades Singulares

## 🤖 Automatización

### Telegram + Make.com

Envía mensajes de voz + fotos por Telegram para añadir propiedades automáticamente.

**Ejemplo:**
```
"Nueva propiedad en Calle Serrano 45, 3 dormitorios, 
2 baños, 150m², precio 2 millones de euros"
[Adjuntar 10 fotos]
```

Ver [INTEGRACION_TELEGRAM_MAKE.md](./INTEGRACION_TELEGRAM_MAKE.md)

### ElevenLabs ConvAI

Habla con el agente de IA en la web para gestionar propiedades.

**Ejemplos:**
- "Cambia el precio de Ayala 45 a 5.5 millones"
- "Lista las propiedades en Salamanca"
- "Elimina la propiedad Serrano 45"

Ver [INTEGRACION_ELEVENLABS.md](./INTEGRACION_ELEVENLABS.md)

## 🏗️ Estructura del Proyecto

```
ibercorp/
├── client/                 # Frontend React
│   ├── public/
│   │   └── img/
│   │       ├── logo-transparent.png
│   │       ├── logo-white-transparent.png
│   │       └── properties/  # Imágenes de propiedades
│   └── src/
│       ├── components/      # Componentes React
│       ├── pages/           # Páginas de la app
│       └── lib/             # Utilidades y datos
├── server/                 # Backend Node.js
│   ├── index.ts            # Servidor principal
│   ├── routes/
│   │   ├── auth.ts         # Autenticación
│   │   └── properties.ts   # CRUD de propiedades
│   └── db/
│       ├── index.ts        # Base de datos
│       └── migrate.ts      # Migraciones
├── data/
│   └── properties.db       # Base de datos SQLite
├── dist/                   # Archivos compilados
├── .env                    # Variables de entorno
├── package.json
└── README.md
```

## 🔐 Seguridad

- ✅ Token de API generado de forma segura
- ✅ Autenticación en endpoints de escritura
- ✅ Variables de entorno para configuración sensible
- ✅ Validación de tipos de archivo en uploads
- ✅ Límites de tamaño en uploads (10MB)
- ✅ HTTPS en producción
- ✅ CORS configurado

## 🧪 Pruebas

```bash
# Probar la API localmente
curl http://localhost:3000/api/health

# Probar listar propiedades
curl http://localhost:3000/api/properties

# Probar crear propiedad (con token)
curl -X POST http://localhost:3000/api/properties \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id":"test","title":"Test","address":"Test 1","zone":"salamanca","price":"1M€","size":100,"bedrooms":2,"bathrooms":1}'
```

## 📊 Tecnologías Utilizadas

### Frontend
- React 19
- TypeScript
- Tailwind CSS
- Wouter (routing)
- Radix UI (componentes)
- Framer Motion (animaciones)

### Backend
- Node.js 22
- Express.js
- Better-SQLite3
- Multer (upload de archivos)
- CORS

### Build & Deploy
- Vite
- esbuild
- pnpm
- Railway / Render

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

MIT License - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

Para preguntas o problemas:

1. Revisa la documentación en los archivos `.md`
2. Verifica que el token de API sea correcto
3. Comprueba los logs del servidor
4. Asegúrate de que las variables de entorno estén configuradas

## ✨ Características Futuras

- [ ] Panel de administración web
- [ ] Autenticación de usuarios
- [ ] Notificaciones por email
- [ ] Integración con WhatsApp Business
- [ ] Dashboard de analytics
- [ ] Export a PDF de propiedades
- [ ] Sistema de favoritos
- [ ] Comparador de propiedades

## 🎉 Agradecimientos

- Equipo de IBERCORP
- Comunidad de React
- Comunidad de Node.js
- Railway y Render por el hosting gratuito

---

**Desarrollado con ❤️ para IBERCORP**

**Versión:** 1.0.0  
**Última actualización:** Febrero 2026
