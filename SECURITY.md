# Seguridad y Autenticación

## Token de API

El sistema utiliza un token de autenticación para proteger los endpoints de gestión de propiedades.

### Token Actual

```
c955e8944aec59d673f1fefa2e82b6249675090ac18bc59e20c42a4cfc11419d
```

**⚠️ IMPORTANTE: Guarda este token de forma segura. Lo necesitarás para:**
- Configurar Make.com
- Configurar ElevenLabs webhook
- Cualquier integración externa

### Cómo Usar el Token

Incluye el token en el header `Authorization` de todas las peticiones a endpoints protegidos:

```bash
Authorization: Bearer c955e8944aec59d673f1fefa2e82b6249675090ac18bc59e20c42a4cfc11419d
```

### Endpoints Protegidos

Los siguientes endpoints requieren autenticación:

- `POST /api/properties` - Crear propiedad
- `PUT /api/properties/:id` - Actualizar propiedad
- `DELETE /api/properties/:id` - Eliminar propiedad
- `POST /api/properties/:id/images` - Subir imágenes

### Endpoints Públicos

Estos endpoints NO requieren autenticación:

- `GET /api/properties` - Listar todas las propiedades
- `GET /api/properties/:id` - Ver una propiedad
- `GET /api/health` - Health check

### Regenerar Token

Si necesitas generar un nuevo token:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Luego actualiza el archivo `.env`:

```env
API_TOKEN=tu_nuevo_token_aqui
```

### Variables de Entorno

El token se configura en el archivo `.env`:

```env
API_TOKEN=c955e8944aec59d673f1fefa2e82b6249675090ac18bc59e20c42a4cfc11419d
PORT=3000
NODE_ENV=development
```

### Seguridad en Producción

Para producción, asegúrate de:

1. ✅ Usar HTTPS
2. ✅ Mantener el token secreto
3. ✅ No commitear el archivo `.env` al repositorio
4. ✅ Rotar el token periódicamente
5. ✅ Usar variables de entorno del hosting

### Ejemplo de Petición Autenticada

```bash
curl -X POST https://tu-dominio.com/api/properties \
  -H "Authorization: Bearer c955e8944aec59d673f1fefa2e82b6249675090ac18bc59e20c42a4cfc11419d" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Piso en Salamanca",
    "address": "Calle Serrano 45",
    "zone": "salamanca",
    "price": "2.000.000 €",
    "size": 150,
    "bedrooms": 3,
    "bathrooms": 2
  }'
```
