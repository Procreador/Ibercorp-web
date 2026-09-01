# Integración Telegram + Make.com

## 📋 Resumen

Este documento explica cómo configurar el sistema para añadir, modificar y eliminar propiedades desde Telegram usando Make.com como intermediario.

## 🎯 Flujo de Trabajo

```
Usuario (Telegram)
    ↓
Envía mensaje de voz + fotos
    ↓
Bot de Telegram recibe
    ↓
Make.com procesa:
    - Transcribe voz con OpenAI
    - Extrae datos estructurados
    - Descarga imágenes
    - Llama a la API de IBERCORP
    ↓
Web IBERCORP actualizada
    ↓
Bot confirma al usuario
```

## 🔧 Configuración Paso a Paso

### 1. Configuración del Bot de Telegram

Ya tienes el bot creado. Necesitarás:
- **Bot Token**: Proporcionado por @BotFather
- **Chat ID**: Tu ID de usuario en Telegram

### 2. Configuración de Make.com

#### Escenario 1: Añadir Nueva Propiedad

**Módulos necesarios:**

1. **Telegram: Watch Updates**
   - Conecta tu bot
   - Filtra: Solo mensajes con texto o voz

2. **OpenAI: Create a Completion** (si es voz)
   - Model: `whisper-1`
   - File: `{{1.message.voice.file_id}}`
   - Transcribe el audio a texto

3. **OpenAI: Create a Chat Completion**
   - Model: `gpt-4`
   - System Prompt:
   ```
   Eres un asistente que extrae información de propiedades inmobiliarias.
   Extrae los siguientes campos del texto y devuélvelos en formato JSON:
   - title: Título descriptivo
   - address: Dirección completa
   - zone: Zona (salamanca, almagro, jeronimos, justicia, la-moraleja, pozuelo, madrid-capital, otras-zonas, singulares)
   - price: Precio (formato: "X.XXX.XXX €")
   - size: Metros cuadrados (número)
   - bedrooms: Número de habitaciones (número)
   - bathrooms: Número de baños (número)
   - description: Descripción detallada
   - features: Array de características
   - reference: Referencia (formato: "XX-XXX")
   - badge: Etiqueta (REFORMADO, PREMIUM, CON GARAJE, etc.)
   ```
   - User Message: `{{transcription o message.text}}`

4. **Telegram: Download a File** (para cada foto)
   - File ID: `{{message.photo[].file_id}}`
   - Repite para cada foto adjunta

5. **HTTP: Make a Request**
   - URL: `https://tu-dominio.com/api/properties`
   - Method: `POST`
   - Headers:
     ```
     Authorization: Bearer REEMPLAZAR_POR_UN_TOKEN_NUEVO
     Content-Type: multipart/form-data
     ```
   - Body:
     - `data`: `{{JSON del paso 3}}`
     - `images[]`: `{{archivos descargados del paso 4}}`

6. **Telegram: Send a Message**
   - Chat ID: `{{1.message.chat.id}}`
   - Text: `✅ Propiedad añadida: {{title}}\nReferencia: {{reference}}`

#### Escenario 2: Modificar Propiedad

Similar al anterior, pero:
- Detecta palabras clave: "modificar", "actualizar", "cambiar"
- Extrae la referencia de la propiedad
- Usa `PUT /api/properties/:id` en lugar de `POST`

#### Escenario 3: Eliminar Propiedad

- Detecta: "eliminar", "borrar", "quitar"
- Extrae la referencia
- Usa `DELETE /api/properties/:id`

## 📝 Ejemplos de Mensajes

### Añadir Propiedad

**Mensaje de voz o texto:**
```
Nueva propiedad en Calle Serrano 45, cuarto A, Barrio de Salamanca.
Tiene 3 dormitorios, 2 baños, 150 metros cuadrados.
Precio: 2 millones de euros.
Completamente reformado con cocina equipada y aire acondicionado.
Referencia AY-045.
```

**Adjuntar:** 5-15 fotos de la propiedad

**Respuesta del bot:**
```
✅ Propiedad añadida: Piso de Lujo en Serrano 45
Referencia: AY-045
Zona: Barrio de Salamanca
Precio: 2.000.000 €
```

### Modificar Propiedad

```
Modificar la propiedad AY-045.
Cambiar el precio a 1.950.000 euros.
```

**Respuesta:**
```
✅ Propiedad AY-045 actualizada
Nuevo precio: 1.950.000 €
```

### Eliminar Propiedad

```
Eliminar la propiedad AY-045
```

**Respuesta:**
```
✅ Propiedad AY-045 eliminada correctamente
```

## 🔗 Endpoints de la API

### Base URL
```
https://tu-dominio.com/api
```

### Autenticación
Todas las peticiones protegidas requieren el header:
```
Authorization: Bearer REEMPLAZAR_POR_UN_TOKEN_NUEVO
```

### Endpoints Disponibles

#### 1. Crear Propiedad
```http
POST /api/properties
Content-Type: multipart/form-data
Authorization: Bearer {token}

data: {
  "id": "ayala-45",
  "title": "Piso de Lujo en Ayala 45",
  "address": "Ayala 45, 4º Dcha. 28001 Madrid",
  "zone": "salamanca",
  "price": "5.695.000 €",
  "size": 323,
  "bedrooms": 3,
  "bathrooms": 3,
  "description": "Espectacular piso...",
  "features": ["Reformado", "Aire acondicionado", "Cocina equipada"],
  "reference": "AY-045",
  "badge": "PREMIUM"
}
images[]: [archivo1.jpg, archivo2.jpg, ...]
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Property created successfully",
  "property": { ... }
}
```

#### 2. Actualizar Propiedad
```http
PUT /api/properties/{id}
Content-Type: multipart/form-data
Authorization: Bearer {token}

data: {
  "price": "1.950.000 €"
}
images[]: [nuevas_fotos...]
```

#### 3. Eliminar Propiedad
```http
DELETE /api/properties/{id}
Authorization: Bearer {token}
```

#### 4. Listar Propiedades (público)
```http
GET /api/properties
```

#### 5. Ver Propiedad (público)
```http
GET /api/properties/{id}
```

## 🎨 Formato de Datos

### Zonas Válidas
- `salamanca` - Barrio de Salamanca
- `almagro` - Almagro
- `jeronimos` - Jerónimos
- `justicia` - Justicia
- `la-moraleja` - La Moraleja
- `pozuelo` - Pozuelo de Alarcón
- `madrid-capital` - Madrid Capital
- `otras-zonas` - Otras Zonas
- `singulares` - Propiedades Singulares

### Badges Disponibles
- `REFORMADO`
- `PREMIUM`
- `CON GARAJE`
- `ÁTICO`
- `EXCLUSIVO`
- `OPORTUNIDAD`

## 🧪 Pruebas

### Probar con cURL

```bash
# Crear propiedad
curl -X POST https://tu-dominio.com/api/properties \
  -H "Authorization: Bearer REEMPLAZAR_POR_UN_TOKEN_NUEVO" \
  -F 'data={"title":"Test","address":"Calle Test","zone":"salamanca","price":"1.000.000 €"}' \
  -F 'images=@foto1.jpg' \
  -F 'images=@foto2.jpg'

# Listar propiedades
curl https://tu-dominio.com/api/properties

# Eliminar propiedad
curl -X DELETE https://tu-dominio.com/api/properties/test-id \
  -H "Authorization: Bearer REEMPLAZAR_POR_UN_TOKEN_NUEVO"
```

## 📞 Soporte

Si tienes problemas:
1. Verifica que el token de autenticación sea correcto
2. Revisa los logs de Make.com
3. Comprueba que las imágenes no superen 10MB cada una
4. Asegúrate de que la zona sea válida

## 🔐 Seguridad

- ✅ Nunca compartas el token de API públicamente
- ✅ Usa HTTPS en producción
- ✅ Limita el acceso al bot de Telegram solo a usuarios autorizados
- ✅ Revisa periódicamente los logs de Make.com
