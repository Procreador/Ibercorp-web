# 🚀 Guía Rápida de Inicio - IBERCORP Automatización

## 📦 Contenido del Paquete

Has recibido el sistema completo de automatización para IBERCORP.com que incluye:

1. ✅ **Backend API REST** - Para gestionar propiedades
2. ✅ **Base de Datos SQLite** - Con 5 propiedades migradas
3. ✅ **Sistema de Autenticación** - Con token seguro
4. ✅ **Sistema de Imágenes** - Upload y gestión de fotos
5. ✅ **Documentación Completa** - Para Telegram y ElevenLabs

## 🎯 Lo Que Puedes Hacer Ahora

### Opción 1: Telegram + Make.com (Para añadir propiedades con fotos)

**Pasos:**
1. Abre el archivo `INTEGRACION_TELEGRAM_MAKE.md`
2. Sigue las instrucciones paso a paso
3. Configura Make.com con tu bot de Telegram
4. Usa el token: `c955e8944aec59d673f1fefa2e82b6249675090ac18bc59e20c42a4cfc11419d`

**Resultado:** Podrás enviar mensajes de voz + fotos por Telegram y se añadirán automáticamente a la web.

### Opción 2: ElevenLabs (Para editar/eliminar propiedades por voz)

**Pasos:**
1. Abre el archivo `INTEGRACION_ELEVENLABS.md`
2. Configura las funciones (Tools) en tu agente
3. Añade el webhook con el token de autenticación
4. Actualiza el System Prompt

**Resultado:** Podrás hablar con el agente en la web para modificar precios, eliminar propiedades, etc.

## 🔑 Información Importante

### Token de API
```
c955e8944aec59d673f1fefa2e82b6249675090ac18bc59e20c42a4cfc11419d
```

**⚠️ Guarda este token de forma segura. Lo necesitas para:**
- Configurar Make.com
- Configurar ElevenLabs
- Cualquier integración externa

### URL del Servidor (Temporal)
```
https://3000-ispoekf9gej7phdwlx06v-87110f7e.us1.manus.computer
```

**Nota:** Esta URL es temporal. Para producción, necesitarás desplegar en tu propio hosting.

## 📁 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `RESUMEN_IMPLEMENTACION.md` | Resumen técnico completo |
| `INTEGRACION_TELEGRAM_MAKE.md` | Guía para Telegram + Make |
| `INTEGRACION_ELEVENLABS.md` | Guía para ElevenLabs |
| `SECURITY.md` | Información de seguridad |
| `.env.example` | Plantilla de variables de entorno |
| `server/routes/properties.ts` | Endpoints de la API |
| `server/db/index.ts` | Operaciones de base de datos |

## 🛠️ Instalación y Uso

### 1. Extraer el Proyecto
```bash
unzip IBERCORP_AUTOMATIZACION_COMPLETA.zip
cd ibercorp
```

### 2. Instalar Dependencias
```bash
pnpm install
```

### 3. Compilar
```bash
pnpm run build
```

### 4. Iniciar Servidor
```bash
API_TOKEN=c955e8944aec59d673f1fefa2e82b6249675090ac18bc59e20c42a4cfc11419d pnpm start
```

## 🧪 Probar la API

### Health Check
```bash
curl https://tu-dominio.com/api/health
```

### Listar Propiedades
```bash
curl https://tu-dominio.com/api/properties
```

### Crear Propiedad (con token)
```bash
curl -X POST https://tu-dominio.com/api/properties \
  -H "Authorization: Bearer c955e8944aec59d673f1fefa2e82b6249675090ac18bc59e20c42a4cfc11419d" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-propiedad",
    "title": "Piso de Prueba",
    "address": "Calle Test 123",
    "zone": "salamanca",
    "price": "1.500.000 €",
    "size": 120,
    "bedrooms": 3,
    "bathrooms": 2
  }'
```

## 📊 Endpoints de la API

### Públicos (sin autenticación)
- `GET /api/health` - Health check
- `GET /api/properties` - Listar propiedades
- `GET /api/properties/:id` - Ver una propiedad

### Protegidos (requieren token)
- `POST /api/properties` - Crear propiedad
- `PUT /api/properties/:id` - Actualizar propiedad
- `DELETE /api/properties/:id` - Eliminar propiedad
- `POST /api/properties/:id/images` - Subir imágenes

## 🎨 Zonas Disponibles

Al crear o modificar propiedades, usa una de estas zonas:

- `salamanca` - Barrio de Salamanca
- `almagro` - Almagro
- `jeronimos` - Jerónimos
- `justicia` - Justicia
- `la-moraleja` - La Moraleja
- `pozuelo` - Pozuelo de Alarcón
- `madrid-capital` - Madrid Capital
- `otras-zonas` - Otras Zonas
- `singulares` - Propiedades Singulares

## 🚀 Despliegue en Producción

### Opción 1: Vercel (Recomendado)
1. Sube el proyecto a GitHub
2. Conecta con Vercel
3. Configura la variable de entorno `API_TOKEN`
4. Despliega

### Opción 2: Hosting Tradicional
1. Compila el proyecto: `pnpm run build`
2. Sube la carpeta `dist/` a tu servidor
3. Configura las variables de entorno
4. Inicia con: `node dist/index.js`

### Opción 3: Docker
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm run build
ENV API_TOKEN=c955e8944aec59d673f1fefa2e82b6249675090ac18bc59e20c42a4cfc11419d
ENV PORT=3000
CMD ["pnpm", "start"]
```

## 📞 Próximos Pasos

1. **Revisa** el archivo `RESUMEN_IMPLEMENTACION.md` para entender la arquitectura completa
2. **Elige** si quieres empezar con Telegram o ElevenLabs (o ambos)
3. **Sigue** la guía correspondiente paso a paso
4. **Prueba** el sistema con propiedades de prueba
5. **Despliega** en producción cuando estés listo

## ⚠️ Notas Importantes

- El token de API es sensible, no lo compartas públicamente
- La base de datos SQLite funciona bien para hasta 10,000 propiedades
- Para más propiedades, considera migrar a PostgreSQL o MySQL
- Usa HTTPS en producción siempre
- Haz backups regulares de la base de datos

## 🎓 Recursos Adicionales

- **Make.com**: https://www.make.com/en/help/tutorials
- **ElevenLabs**: https://elevenlabs.io/docs
- **Telegram Bots**: https://core.telegram.org/bots
- **Express.js**: https://expressjs.com/
- **SQLite**: https://www.sqlite.org/docs.html

## 💡 Consejos

1. **Empieza con Telegram** si necesitas añadir propiedades con fotos frecuentemente
2. **Usa ElevenLabs** para cambios rápidos (precios, descripciones)
3. **Combina ambos** para la mejor experiencia
4. **Prueba primero** con propiedades de prueba antes de usar en producción
5. **Haz backups** de la base de datos regularmente

## ✅ Checklist de Implementación

- [ ] Extraer y revisar el proyecto
- [ ] Leer `RESUMEN_IMPLEMENTACION.md`
- [ ] Instalar dependencias (`pnpm install`)
- [ ] Probar localmente (`pnpm run dev`)
- [ ] Configurar Telegram + Make.com
- [ ] Configurar ElevenLabs
- [ ] Probar ambas integraciones
- [ ] Desplegar en producción
- [ ] Configurar backups
- [ ] Documentar para tu equipo

## 🎉 ¡Listo!

Ya tienes todo lo necesario para automatizar la gestión de propiedades de IBERCORP.com. Si tienes dudas, revisa la documentación detallada en los archivos `.md` incluidos.

**¡Mucha suerte con tu proyecto!** 🚀
