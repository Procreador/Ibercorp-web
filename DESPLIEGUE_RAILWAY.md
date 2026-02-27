# 🚂 Guía de Despliegue en Railway - IBERCORP

## 📋 Requisitos Previos

- ✅ Cuenta de GitHub (gratuita)
- ✅ Cuenta de Railway (gratuita) - https://railway.app
- ✅ El proyecto IBERCORP (ya lo tienes)

## ⏱️ Tiempo Estimado: 10 minutos

---

## 🎯 Paso 1: Crear Repositorio en GitHub

### 1.1 Crear Nuevo Repositorio

1. Ve a https://github.com/new
2. Nombre del repositorio: `ibercorp-web`
3. Descripción: `IBERCORP - Gestión de Propiedades con Automatización`
4. Visibilidad: **Private** (recomendado)
5. **NO** marques "Add a README file"
6. Haz clic en **"Create repository"**

### 1.2 Subir el Código

GitHub te mostrará instrucciones. Usa estas (ya tienes el repo Git inicializado):

```bash
# Navega al proyecto
cd /ruta/a/ibercorp

# Agrega el remote de GitHub (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/ibercorp-web.git

# Sube el código
git push -u origin main
```

**Nota:** GitHub te pedirá autenticación. Usa un Personal Access Token si es necesario.

---

## 🚀 Paso 2: Desplegar en Railway

### 2.1 Crear Cuenta en Railway

1. Ve a https://railway.app
2. Haz clic en **"Start a New Project"**
3. Inicia sesión con GitHub
4. Autoriza Railway para acceder a tus repositorios

### 2.2 Crear Nuevo Proyecto

1. En Railway, haz clic en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Busca y selecciona **`ibercorp-web`**
4. Railway detectará automáticamente que es un proyecto Node.js

### 2.3 Configurar Variables de Entorno

1. En el dashboard de Railway, haz clic en tu proyecto
2. Ve a la pestaña **"Variables"**
3. Agrega las siguientes variables:

| Variable | Valor |
|----------|-------|
| `API_TOKEN` | `c955e8944aec59d673f1fefa2e82b6249675090ac18bc59e20c42a4cfc11419d` |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

4. Haz clic en **"Add Variable"** para cada una

### 2.4 Configurar el Build

Railway debería detectar automáticamente el `railway.json`. Si no:

1. Ve a **"Settings"**
2. En **"Build Command"**: `pnpm install && pnpm run build`
3. En **"Start Command"**: `pnpm start`

### 2.5 Desplegar

1. Railway comenzará a construir y desplegar automáticamente
2. Espera 2-3 minutos
3. Verás el progreso en tiempo real

---

## 🌐 Paso 3: Obtener la URL Permanente

### 3.1 Generar Dominio Público

1. En el dashboard de Railway, ve a **"Settings"**
2. Busca la sección **"Domains"**
3. Haz clic en **"Generate Domain"**
4. Railway te dará una URL como: `https://ibercorp-web-production.up.railway.app`

### 3.2 (Opcional) Usar Dominio Personalizado

Si tienes un dominio propio (ej: `www.ibercorp.com`):

1. En Railway, ve a **"Settings" → "Domains"**
2. Haz clic en **"Custom Domain"**
3. Ingresa tu dominio: `www.ibercorp.com`
4. Railway te dará un registro CNAME para configurar en tu DNS
5. Agrega el CNAME en tu proveedor de dominio
6. Espera 5-10 minutos para la propagación

---

## ✅ Paso 4: Verificar el Despliegue

### 4.1 Probar la API

Abre tu navegador y ve a:

```
https://tu-dominio.up.railway.app/api/health
```

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "2026-02-17T..."
}
```

### 4.2 Probar la Web

```
https://tu-dominio.up.railway.app
```

Deberías ver la página de inicio de IBERCORP con el logo y el carrusel.

### 4.3 Probar la API de Propiedades

```
https://tu-dominio.up.railway.app/api/properties
```

Deberías ver la lista de propiedades en formato JSON.

---

## 🔧 Paso 5: Configurar Integraciones

Ahora que tienes la URL permanente, actualiza:

### 5.1 Make.com (Telegram)

1. Abre tu escenario en Make.com
2. En el módulo HTTP, cambia la URL a:
   ```
   https://tu-dominio.up.railway.app/api/properties
   ```
3. Asegúrate de incluir el header:
   ```
   Authorization: Bearer c955e8944aec59d673f1fefa2e82b6249675090ac18bc59e20c42a4cfc11419d
   ```

### 5.2 ElevenLabs

1. Ve a tu agente en ElevenLabs
2. En la configuración de Webhooks, actualiza la URL base:
   ```
   https://tu-dominio.up.railway.app/api
   ```
3. Configura las funciones (Tools) con las nuevas URLs

---

## 📊 Monitoreo y Logs

### Ver Logs en Tiempo Real

1. En Railway, haz clic en tu proyecto
2. Ve a la pestaña **"Deployments"**
3. Haz clic en el deployment activo
4. Verás los logs en tiempo real

### Métricas

Railway te muestra:
- CPU usage
- Memory usage
- Network traffic
- Request count

---

## 🔄 Actualizar el Proyecto

Cuando hagas cambios al código:

```bash
# Haz tus cambios en el código
# ...

# Commit los cambios
git add .
git commit -m "Descripción de los cambios"

# Sube a GitHub
git push origin main
```

**Railway desplegará automáticamente** los cambios en 2-3 minutos.

---

## 💰 Costos

### Plan Gratuito de Railway

- ✅ $5 USD de crédito gratis al mes
- ✅ Suficiente para ~500 horas de ejecución
- ✅ Bases de datos incluidas
- ✅ SSL/TLS gratuito
- ✅ Despliegues ilimitados

### Si Necesitas Más

- **Hobby Plan**: $5 USD/mes
- **Pro Plan**: $20 USD/mes

Para IBERCORP, el plan gratuito debería ser suficiente inicialmente.

---

## 🛡️ Seguridad

### Proteger el Token de API

1. **NUNCA** compartas el token públicamente
2. Usa variables de entorno (ya configuradas)
3. Rota el token cada 3-6 meses

### Generar Nuevo Token

Si necesitas un nuevo token:

```bash
curl -X POST https://tu-dominio.up.railway.app/api/generate-token
```

Actualiza el token en:
- Variables de entorno de Railway
- Make.com
- ElevenLabs

---

## 🔥 Troubleshooting

### El deploy falla

**Problema:** Build error

**Solución:**
1. Verifica que `pnpm` esté en las dependencias
2. Revisa los logs en Railway
3. Asegúrate de que `railway.json` esté en el repo

### La base de datos está vacía

**Problema:** No hay propiedades

**Solución:**
1. Conéctate por SSH a Railway (en Settings)
2. Ejecuta: `pnpm run migrate`

### Error 401 en la API

**Problema:** Unauthorized

**Solución:**
1. Verifica que `API_TOKEN` esté configurado en Railway
2. Asegúrate de incluir el header `Authorization` en las peticiones

---

## 📞 Soporte

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **GitHub Issues**: Crea un issue en tu repositorio

---

## ✨ ¡Listo!

Tu aplicación IBERCORP está ahora desplegada permanentemente en Railway con:

- ✅ URL pública y permanente
- ✅ SSL/TLS automático
- ✅ Despliegues automáticos desde Git
- ✅ Variables de entorno configuradas
- ✅ Monitoreo y logs en tiempo real

**URL de tu aplicación:**
```
https://tu-dominio.up.railway.app
```

**Comparte esta URL con tu clienta** y ella podrá acceder al sistema desde cualquier lugar.

---

## 🎯 Próximos Pasos

1. ✅ Configura Make.com con la nueva URL
2. ✅ Configura ElevenLabs con la nueva URL
3. ✅ Prueba el sistema completo
4. ✅ Haz un backup de la base de datos
5. ✅ Documenta para tu equipo

**¡Felicidades! Tu sistema está en producción.** 🎉
