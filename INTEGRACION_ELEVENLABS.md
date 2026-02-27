# Integración ElevenLabs ConvAI

## 📋 Resumen

Este documento explica cómo configurar el agente de voz de ElevenLabs para gestionar propiedades mediante comandos de voz directamente desde la web.

## 🎯 Flujo de Trabajo

```
Usuario (en la web)
    ↓
Habla con el agente de ElevenLabs
"Cambia el precio de Serrano 45 a 1.9 millones"
    ↓
Agente procesa con IA
    ↓
Llama al webhook de tu API
    ↓
API actualiza la propiedad
    ↓
Agente confirma por voz
"He actualizado el precio a 1.900.000 euros"
```

## 🔧 Configuración en ElevenLabs

### 1. Acceder a tu Agente

Tu agente actual: `agent_1701kez3aj70f2nas4vaagr5s9sq`

1. Ve a https://elevenlabs.io/app/conversational-ai
2. Selecciona tu agente IBERCORP
3. Ve a la sección "Tools" (Herramientas)

### 2. Configurar Webhook

#### Webhook URL
```
https://tu-dominio.com/api/properties/webhook
```

#### Método
```
POST
```

#### Headers
```json
{
  "Authorization": "Bearer c955e8944aec59d673f1fefa2e82b6249675090ac18bc59e20c42a4cfc11419d",
  "Content-Type": "application/json"
}
```

### 3. Crear Funciones (Tools)

#### Función 1: Actualizar Precio

**Nombre:** `update_property_price`

**Descripción:**
```
Actualiza el precio de una propiedad existente.
```

**Parámetros:**
```json
{
  "type": "object",
  "properties": {
    "property_id": {
      "type": "string",
      "description": "ID o referencia de la propiedad (ej: 'ayala-45' o 'AY-045')"
    },
    "new_price": {
      "type": "string",
      "description": "Nuevo precio en formato '1.950.000 €'"
    }
  },
  "required": ["property_id", "new_price"]
}
```

**Webhook URL:**
```
https://tu-dominio.com/api/properties/{{property_id}}
```

**Método:** `PUT`

**Body:**
```json
{
  "price": "{{new_price}}"
}
```

#### Función 2: Listar Propiedades

**Nombre:** `list_properties`

**Descripción:**
```
Lista todas las propiedades disponibles con sus referencias y precios.
```

**Parámetros:**
```json
{
  "type": "object",
  "properties": {
    "zone": {
      "type": "string",
      "description": "Zona opcional para filtrar (salamanca, almagro, etc.)",
      "enum": ["salamanca", "almagro", "jeronimos", "justicia", "la-moraleja", "pozuelo", "madrid-capital", "otras-zonas", "singulares"]
    }
  }
}
```

**Webhook URL:**
```
https://tu-dominio.com/api/properties
```

**Método:** `GET`

#### Función 3: Ver Detalles de Propiedad

**Nombre:** `get_property_details`

**Descripción:**
```
Obtiene los detalles completos de una propiedad específica.
```

**Parámetros:**
```json
{
  "type": "object",
  "properties": {
    "property_id": {
      "type": "string",
      "description": "ID o referencia de la propiedad"
    }
  },
  "required": ["property_id"]
}
```

**Webhook URL:**
```
https://tu-dominio.com/api/properties/{{property_id}}
```

**Método:** `GET`

#### Función 4: Eliminar Propiedad

**Nombre:** `delete_property`

**Descripción:**
```
Elimina una propiedad del catálogo. Requiere confirmación del usuario.
```

**Parámetros:**
```json
{
  "type": "object",
  "properties": {
    "property_id": {
      "type": "string",
      "description": "ID o referencia de la propiedad a eliminar"
    }
  },
  "required": ["property_id"]
}
```

**Webhook URL:**
```
https://tu-dominio.com/api/properties/{{property_id}}
```

**Método:** `DELETE`

### 4. Configurar el Prompt del Sistema

Ve a la sección "System Prompt" y añade:

```
Eres el asistente virtual de IBERCORP, una empresa de gestión de propiedades de lujo en Madrid.

Tu función es ayudar a gestionar el catálogo de propiedades mediante comandos de voz.

CAPACIDADES:
- Listar propiedades disponibles
- Consultar detalles de una propiedad específica
- Actualizar el precio de propiedades
- Eliminar propiedades (con confirmación)

FORMATO DE REFERENCIAS:
Las propiedades se identifican por su referencia (ej: AY-045, NB-085) o por su dirección (ej: "Ayala 45", "Serrano 45").

ZONAS DISPONIBLES:
- Barrio de Salamanca
- Almagro
- Jerónimos
- Justicia
- La Moraleja
- Pozuelo de Alarcón
- Madrid Capital
- Otras Zonas
- Propiedades Singulares

INSTRUCCIONES:
1. Cuando el usuario mencione una propiedad, identifica su referencia o dirección
2. Para cambios de precio, confirma el nuevo precio antes de aplicarlo
3. Para eliminaciones, SIEMPRE pide confirmación explícita
4. Proporciona feedback claro sobre las acciones realizadas
5. Si hay un error, explica qué salió mal de forma amigable

EJEMPLOS DE INTERACCIÓN:

Usuario: "¿Qué propiedades tenemos en Salamanca?"
Tú: [Llamas a list_properties con zone="salamanca"] "Tenemos 3 propiedades en el Barrio de Salamanca: Ayala 10 por precio a consultar, Ayala 45 por 5.695.000 euros, y Núñez de Balboa 85 por 2.450.000 euros."

Usuario: "Cambia el precio de Ayala 45 a 5.5 millones"
Tú: "Perfecto, voy a actualizar el precio de la propiedad Ayala 45 a 5.500.000 euros. ¿Confirmas?" 
Usuario: "Sí"
Tú: [Llamas a update_property_price] "Hecho. El precio de Ayala 45 ahora es 5.500.000 euros."

Usuario: "Elimina la propiedad Serrano 45"
Tú: "¿Estás seguro de que quieres eliminar la propiedad Serrano 45? Esta acción no se puede deshacer."
Usuario: "Sí, elimínala"
Tú: [Llamas a delete_property] "La propiedad Serrano 45 ha sido eliminada del catálogo."

Sé profesional, eficiente y amigable en todo momento.
```

### 5. Configurar Variables Dinámicas

En la sección "Dynamic Variables":

```json
{
  "api_base_url": "https://tu-dominio.com/api",
  "api_token": "c955e8944aec59d673f1fefa2e82b6249675090ac18bc59e20c42a4cfc11419d"
}
```

## 📝 Ejemplos de Uso

### Consultar Propiedades

**Usuario:**
> "¿Qué propiedades tenemos disponibles?"

**Agente:**
> "Actualmente tenemos 4 propiedades: Ayala 10 en Salamanca, Ayala 45 en Salamanca, López de Hoyos 11 en Justicia, y Núñez de Balboa 85 en Salamanca."

### Actualizar Precio

**Usuario:**
> "Cambia el precio de la propiedad AY-045 a 5.5 millones de euros"

**Agente:**
> "Perfecto, voy a actualizar el precio de Ayala 45 a 5.500.000 euros. ¿Confirmas?"

**Usuario:**
> "Sí"

**Agente:**
> "Hecho. El precio ha sido actualizado a 5.500.000 euros."

### Ver Detalles

**Usuario:**
> "Dame los detalles de Ayala 10"

**Agente:**
> "La propiedad Ayala 10 es un piso señorial de 220 metros cuadrados con 4 habitaciones y 4 baños en el Barrio de Salamanca. Está completamente reformado y el precio es a consultar."

### Eliminar Propiedad

**Usuario:**
> "Elimina la propiedad López de Hoyos 11"

**Agente:**
> "¿Estás seguro de que quieres eliminar López de Hoyos 11? Esta acción no se puede deshacer."

**Usuario:**
> "Sí, confir...(content truncated)...ades
- ✅ Usa HTTPS en producción
- ✅ Limita el acceso al agente solo a usuarios autorizados
- ✅ Revisa los logs de ElevenLabs periódicamente

## 🎓 Mejores Prácticas

1. **Confirmaciones**: Siempre pide confirmación para acciones destructivas
2. **Feedback claro**: Informa al usuario sobre el resultado de cada acción
3. **Manejo de errores**: Si algo falla, explica qué pasó de forma amigable
4. **Referencias flexibles**: Acepta tanto referencias (AY-045) como direcciones (Ayala 45)
5. **Conversación natural**: Mantén un tono profesional pero cercano
