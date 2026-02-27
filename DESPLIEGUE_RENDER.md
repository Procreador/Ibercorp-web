# 🎨 Guía de Despliegue en Render - IBERCORP

## 📋 Requisitos Previos

- ✅ Cuenta de GitHub (gratuita)
- ✅ Cuenta de Render (gratuita) - https://render.com
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

```bash
# Navega al proyecto
cd /ruta/a/ibercorp

# Agrega el remote de GitHub (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/ibercorp-web.git

# Sube el código
git push -u origin main
```

---

## 🚀 Paso 2: Desplegar en Render

### 2.1 Crear Cuenta en Render

1. Ve a https://render.com
2. Haz clic en **"Get Started"**
3. Inicia sesión con GitHub
4. Autoriza Render para acceder a tus repositorios

### 2.2 Crear Nuevo Web Service

1. En el dashboard de Render, haz clic en **"New +"**
2. Selecciona **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Busca y selecciona **`ibercorp-web`**
5. Haz clic en **"Connect"**

### 2.3 Configurar el Servicio

Completa el formulario con estos valores:

| Campo | Valor |
|-------|-------|
| **Name** | `ibercorp-web` |
| **Region** | `Frankfurt (EU Central)` o el más cercano |
| **Branch** | `main` |
| **Root Directory** | (dejar vacío) |
| **Runtime** | `Node` |
| **Build Command** | `pnpm install && pnpm run build` |
| **Start Command** | `pnpm start` |
| **Instance Type** | `Free` |

### 2.4 Configurar Variables de Entorno

Antes de hacer clic en "Create Web Service", baja hasta **"Environment Variables"**:

Haz clic en **"Add Environment Variable"** y agrega:

| Key | Value |
|-----|-------|
| `API_TOKEN` | `c955e8944aec59d673f1fefa2e82b6249675090ac18bc59e20c42a4cfc11419d` |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

### 2.5 Desplegar

1. Haz clic en **"Create Web Service"**
2. Render comenzará a construir y desplegar
3. Espera 3-5 minutos
4. Verás el progreso en tiempo real en los logs

---

## 🌐 Paso 3: Obtener la URL Permanente

### 3.1 URL Automática

Render te asigna automáticamente una URL como:
```
https://ibercorp-web.onrender.com
```

Esta URL es **permanente** y **gratuita**.

### 3.2 (Opcional) Usar Dominio Personalizado

Si tienes un dominio propio (ej: `www.ibercorp.com`):

1. En Render, ve a tu servicio
2. Haz clic en **"Settings"**
3. Busca la sección **"Custom Domain"**
4. Haz clic en **"Add Custom Domain"**
5. Ingresa: `www.ibercorp.com`
6. Render te dará un registro CNAME:
   ```
   CNAME: www.ibercorp.com → ibercorp-web.onrender.com
   ```
7. Agrega este CNAME en tu proveedor de dominio
8. Espera 5-10 minutos para la propagación
9. Render generará automáticamente un certificado SSL

---

## ✅ Paso 4: Verificar el Despliegue

### 4.1 Probar la API

Abre tu navegador y ve a:

```
https://ibercorp-web.onrender.com/api/health
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
https://ibercorp-web.onrender.com
```

Deberías ver la página de inicio de IBERCORP.

### 4.3 Probar la API de Propiedades

```
https://ibercorp-web.onrender.com/api/properties
```

Deberías ver la lista de propiedades.

---

## ⚠️ Importante: Plan Gratuito de Render

### Limitación de "Cold Start"

El plan gratuito de Render tiene una característica importante:

- **Después de 15 minutos de inactividad, el servicio se "duerme"**
- La primera petición después de dormir tarda **30-60 segundos** en responder
- Las peticiones subsecuentes son normales

### Solución: Mantener el Servicio Activo

**Opción 1: Cron Job Externo** (Recomendado)

Usa un servicio como [cron-job.org](https://cron-job.org) (gratuito):

1. Crea una cuenta en https://cron-job.org
2. Crea un nuevo cron job:
   - URL: `https://ibercorp-web.onrender.com/api/health`
   - Intervalo: Cada 10 minutos
3. Esto mantendrá tu servicio activo

**Opción 2: Actualizar a Plan de Pago**

- **Starter Plan**: $7 USD/mes
- Sin "cold starts"
- Siempre activo

---

## 🔧 Paso 5: Configurar Integraciones

Ahora que tienes la URL permanente:

### 5.1 Make.com (Telegram)

1. Abre tu escenario en Make.com
2. En el módulo HTTP, cambia la URL a:
   ```
   https://ibercorp-web.onrender.com/api/properties
   ```
3. Header de autorización:
   ```
   Authorization: Bearer c955e8944aec59d673f1fefa2e82b6249675090ac18bc59e20c42a4cfc11419d
   ```

### 5.2 ElevenLabs

1. Ve a tu agente en ElevenLabs
2. Actualiza la URL base del webhook:
   ```
   https://ibercorp-web.onrender.com/api
   ```

---

## 📊 Monitoreo y Logs

### Ver Logs en Tiempo Real

1. En Render, ve a tu servicio
2. Haz clic en **"Logs"** en el menú lateral
3. Verás los logs en tiempo real
4. Puedes filtrar por nivel (info, error, etc.)

### Métricas

Render te muestra:
- CPU usage
- Memory usage
- Bandwidth
- Request count
- Response times

### Alertas

Configura alertas por email:

1. Ve a **"Settings"**
2. Busca **"Notifications"**
3. Activa alertas para:
   - Deploy failures
   - Service crashes
   - High memory usage

---

## 🔄 Actualizar el Proyecto

Cuando hagas cambios:

```bash
# Haz tus cambios
# ...

# Commit
git add .
git commit -m "Descripción de cambios"

# Push
git push origin main
```

**Render desplegará automáticamente** en 3-5 minutos.

### Desactivar Auto-Deploy

Si quieres control manual:

1. Ve a **"Settings"**
2. Busca **"Build & Deploy"**
3. Desactiva **"Auto-Deploy"**
4. Despliega manualmente con el botón **"Manual Deploy"**

---

## 💰 Costos

### Plan Gratuito

- ✅ 750 horas/mes de ejecución
- ✅ SSL/TLS gratuito
- ✅ Despliegues ilimitados
- ✅ 100GB de ancho de banda
- ⚠️ "Cold starts" después de 15 min de inactividad

### Planes de Pago

- **Starter**: $7 USD/mes
  - Sin cold starts
  - Siempre activo
  - 400 horas de build/mes

- **Standard**: $25 USD/mes
  - 2GB RAM
  - 2 CPUs
  - 1000 horas de build/mes

Para IBERCORP, el **plan gratuito + cron-job.org** es suficiente.

---

## 🛡️ Seguridad

### HTTPS Automático

Render proporciona:
- ✅ Certificados SSL/TLS gratuitos
- ✅ Renovación automática
- ✅ Redirección HTTP → HTTPS

### Proteger Variables de Entorno

1. Las variables están encriptadas
2. No son visibles en logs
3. Solo accesibles por tu servicio

### Rotar Token de API

Si necesitas cambiar el token:

1. Genera uno nuevo:
   ```bash
   curl -X POST https://ibercorp-web.onrender.com/api/generate-token
   ```
2. Actualiza en Render:
   - Ve a **"Environment"**
   - Edita `API_TOKEN`
   - Haz clic en **"Save Changes"**
3. Render reiniciará automáticamente

---

## 🔥 Troubleshooting

### Build falla

**Problema:** Error durante el build

**Solución:**
1. Verifica los logs en Render
2. Asegúrate de que `pnpm` esté instalado
3. Revisa que el `package.json` tenga el script `build`

### Servicio no responde

**Problema:** 503 Service Unavailable

**Solución:**
1. El servicio puede estar "dormido" (cold start)
2. Espera 30-60 segundos
3. Recarga la página
4. Considera usar cron-job.org

### Base de datos vacía

**Problema:** No hay propiedades

**Solución:**
1. En Render, ve a **"Shell"**
2. Ejecuta: `pnpm run migrate`
3. Verifica con: `curl https://tu-url.onrender.com/api/properties`

### Error 401

**Problema:** Unauthorized

**Solución:**
1. Verifica que `API_TOKEN` esté en las variables de entorno
2. Asegúrate de incluir el header `Authorization` en las peticiones

---

## 📞 Soporte

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Render Status**: https://status.render.com

---

## ✨ ¡Listo!

Tu aplicación IBERCORP está desplegada en Render con:

- ✅ URL pública permanente
- ✅ SSL/TLS automático
- ✅ Despliegues automáticos desde Git
- ✅ Variables de entorno seguras
- ✅ Logs y métricas en tiempo real

**URL de tu aplicación:**
```
https://ibercorp-web.onrender.com
```

---

## 🎯 Comparación: Render vs Railway

| Característica | Render | Railway |
|----------------|--------|---------|
| Plan Gratuito | 750h/mes | $5 crédito/mes |
| Cold Starts | Sí (15 min) | No |
| SSL/TLS | ✅ Gratis | ✅ Gratis |
| Dominio Custom | ✅ Gratis | ✅ Gratis |
| Build Time | 3-5 min | 2-3 min |
| Logs | ✅ | ✅ |
| Métricas | ✅ | ✅ |
| Precio Starter | $7/mes | $5/mes |

**Recomendación:**
- **Render**: Si quieres plan gratuito + cron-job
- **Railway**: Si quieres evitar cold starts desde el inicio

---

## 🎉 ¡Felicidades!

Tu sistema IBERCORP está en producción y listo para usar.

**Próximos pasos:**
1. ✅ Configura cron-job.org para evitar cold starts
2. ✅ Actualiza Make.com con la nueva URL
3. ✅ Actualiza ElevenLabs con la nueva URL
4. ✅ Prueba el sistema completo
5. ✅ Comparte la URL con tu clienta

**¡Todo listo para automatizar la gestión de propiedades!** 🚀
