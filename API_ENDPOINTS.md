# API Endpoints — eirl.pe Backend

**Base URL:** `http://localhost:3000/api`
**Prefijo global:** `/api`

---

## Leyenda de autenticación

| Símbolo | Significado |
|---|---|
| 🔓 | Público — sin autenticación |
| 🔑 | Requiere JWT de plataforma (`Authorization: Bearer <token>`) |
| 🏠 | Requiere header de tenant (`x-tenant-host: <hostname>`) |
| 🔐 | Requiere JWT de tenant (`Authorization: Bearer <tenant_token>`) |

> Los endpoints con 🏠 también requieren que el hostname esté registrado en la tabla `hostnames`.

---

## 1. Auth (Plataforma)

> Autenticación de usuarios de la plataforma eirl.pe (no del tenant).

**Base:** `/api/auth`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/auth/register` | 🔓 | Registrar nuevo usuario de plataforma |
| `POST` | `/auth/login` | 🔓 | Login — devuelve `access_token` JWT |
| `GET` | `/auth/profile` | 🔑 | Perfil del usuario autenticado |
| `GET` | `/auth/hostnames/:userId` | 🔑 | Hostnames asociados a un usuario |

### `POST /auth/register`
```json
{
  "email": "usuario@ejemplo.com",
  "password": "MiPassword123"
}
```

### `POST /auth/login`
```json
{
  "email": "usuario@ejemplo.com",
  "password": "MiPassword123"
}
```
**Respuesta:** `{ "access_token": "eyJ...", "user": { "id": 1, "email": "...", "role": "admin", "userProfile": {...} } }`

---

## 2. Users (Plataforma)

> CRUD de usuarios de la plataforma.

**Base:** `/api/users` — 🔑 Todos requieren JWT de plataforma

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/users` | 🔑 | Listar todos los usuarios |
| `GET` | `/users/:id` | 🔑 | Obtener usuario por ID |
| `PATCH` | `/users/:id` | 🔑 admin | Editar usuario (email, role) |
| `DELETE` | `/users/:id` | 🔑 admin | Eliminar usuario |

---

## 3. Hostnames

> Gestión de subdominios/hostnames de los tenants.

**Base:** `/api/hostnames`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/hostnames/check/:hostname` | 🔓 | Verificar disponibilidad de un hostname |
| `GET` | `/hostnames` | 🔑 | Listar todos los hostnames |
| `GET` | `/hostnames/:id` | 🔑 | Obtener hostname por ID |
| `POST` | `/hostnames` | 🔑 | Crear hostname (y genera la BD del tenant automáticamente) |
| `PATCH` | `/hostnames/:id` | 🔑 admin | Editar hostname |
| `DELETE` | `/hostnames/:id` | 🔑 admin | Eliminar hostname |

### `POST /hostnames`
```json
{
  "hostname": "mi-negocio"
}
```

---

## 4. User Profile (Plataforma)

> Perfil extendido del usuario de plataforma.

**Base:** `/api/user-profile` — 🔑 Todos requieren JWT de plataforma

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/user-profile` | 🔑 | Listar todos los perfiles |
| `GET` | `/user-profile/me` | 🔑 | Mi perfil (del token actual) |
| `GET` | `/user-profile/:id` | 🔑 | Perfil por ID |
| `GET` | `/user-profile/user/:userId` | 🔑 | Perfil por ID de usuario |
| `GET` | `/user-profile/hostname/:hostnameId` | 🔑 | Perfil por ID de hostname |
| `PUT` | `/user-profile/:id` | 🔑 | Actualizar perfil |
| `DELETE` | `/user-profile/:id` | 🔑 | Eliminar perfil |

### `PUT /user-profile/:id`
```json
{
  "document": "12345678",
  "phone": "+51999888777",
  "company_name": "Mi Empresa SAC",
  "address": "Av. Principal 123",
  "ruc_company": "20123456789"
}
```

---

## 5. Available (Plataforma)

> Controla si un usuario tiene acceso/disponibilidad al tenant.

**Base:** `/api/available`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/available/check/:userId` | 🔓 | Verificar disponibilidad de un usuario |
| `GET` | `/available` | 🔑 | Listar todos los registros |
| `GET` | `/available/me` | 🔑 | Mi disponibilidad |
| `GET` | `/available/:id` | 🔑 | Registro por ID |
| `POST` | `/available` | 🔑 | Crear/actualizar disponibilidad propia |
| `POST` | `/available/user/:userId` | 🔑 | Crear/actualizar disponibilidad de un usuario |
| `DELETE` | `/available/:id` | 🔑 | Eliminar registro |

### `POST /available`
```json
{ "available": true }
```

---

## 6. Tenant Users

> Usuarios administrativos de cada tenant (base de datos propia del tenant).

**Base:** `/api/tenant-users` — 🏠 Todos requieren `x-tenant-host`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/tenant-users/register` | 🏠 | Registrar usuario del tenant |
| `POST` | `/tenant-users/login` | 🏠 | Login tenant — devuelve `access_token` propio |
| `GET` | `/tenant-users/profile` | 🏠🔐 | Perfil del usuario tenant autenticado |
| `GET` | `/tenant-users` | 🏠🔐 admin | Listar usuarios del tenant |
| `GET` | `/tenant-users/:id` | 🏠🔐 admin | Obtener usuario por ID |
| `PATCH` | `/tenant-users/:id/status` | 🏠🔐 admin | Cambiar estado (`active` / `suspended`) |
| `PATCH` | `/tenant-users/:id/role` | 🏠🔐 admin | Cambiar rol (`user` / `admin`) |

### `POST /tenant-users/register`
```json
{
  "mail": "admin@miempresa.com",
  "password": "Password123",
  "name": "Nombre Apellido"
}
```

### `POST /tenant-users/login`
```json
{
  "mail": "admin@miempresa.com",
  "password": "Password123"
}
```
**Respuesta:** `{ "user": {...}, "access_token": "eyJ..." }`

> ⚠️ El token devuelto por `/tenant-users/login` es distinto al de `/auth/login`. Usar el tenant token para endpoints 🔐.

---

## 7. Tenant Contacts

> Leads / formularios de contacto capturados en la landing page del tenant.

**Base:** `/api/tenant-contacts` — 🏠 Todos requieren `x-tenant-host`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/tenant-contacts` | 🏠 | Crear contacto (formulario público de la landing) |
| `GET` | `/tenant-contacts` | 🏠🔑 | Listar todos los contactos |
| `GET` | `/tenant-contacts/:id` | 🏠🔑 | Obtener contacto por ID |
| `PATCH` | `/tenant-contacts/:id/status` | 🏠🔑 | Actualizar estado del contacto |
| `DELETE` | `/tenant-contacts/:id` | 🏠🔑 | Eliminar contacto |

### `POST /tenant-contacts`
```json
{
  "name": "Juan Pérez",
  "phone": "+51999888777",
  "mail": "juan@ejemplo.com",
  "message": "Me interesa saber más sobre sus servicios"
}
```

### Estados de contacto
`pending` | `read` | `replied` | `archived`

---

## 8. Tenant Config

> Configuración del template y personalización visual del tenant.

**Base:** `/api/tenant-config` — 🏠 Todos requieren `x-tenant-host`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/tenant-config` | 🏠 | Obtener config activa del tenant |
| `GET` | `/tenant-config/editor-data` | 🏠🔐 | Datos para el editor: campos + valores actuales |
| `PUT` | `/tenant-config` | 🏠🔐 | Crear o actualizar la config (upsert) |

### `PUT /tenant-config`
```json
{
  "templateId": "plan-basico-opcion-1",
  "businessName": "Mi Empresa SAC",
  "isActive": true,
  "customization": {
    "ESTILO_FUENTE": "font-opcion-1",
    "ESTILO_COLOR": "color-opcion-2",
    "LOGO_EMPRESA": "Mi Empresa",
    "TITULO_PRINCIPAL": "Bienvenidos a Mi Empresa",
    "SUBTITULO_DESCRIPTIVO": "Soluciones profesionales",
    "TEXTO_BOTON_PRINCIPAL": "Contáctanos",
    "TEXTO_BOTON_SECUNDARIO": "Ver servicios",
    "TITULO_SERVICIO_1": "Consultoría",
    "DESCRIPCION_SERVICIO_1": "Asesoría personalizada",
    "ICONO_1": "💼",
    "TITULO_SERVICIO_2": "Desarrollo",
    "DESCRIPCION_SERVICIO_2": "Soluciones digitales",
    "ICONO_2": "🚀",
    "TITULO_SERVICIO_3": "Soporte",
    "DESCRIPCION_SERVICIO_3": "Atención continua",
    "ICONO_3": "🛟",
    "TITULO_SECCION_SOBRE_NOSOTROS": "Sobre Nosotros",
    "DESCRIPCION_SOBRE_NOSOTROS_PARRAFO_1": "Somos una empresa...",
    "DESCRIPCION_SOBRE_NOSOTROS_PARRAFO_2": "Con años de experiencia...",
    "EMAIL_CONTACTO": "hola@miempresa.com",
    "TELEFONO_CONTACTO": "+51 999 111 222",
    "DIRECCION_CONTACTO": "Av. Lima 456, Miraflores",
    "TEXTO_FOOTER": "Tu éxito es nuestro compromiso",
    "NOMBRE_EMPRESA": "Mi Empresa"
  }
}
```

### Templates disponibles

| `templateId` | Nombre |
|---|---|
| `plan-basico-opcion-1` | Plan Básico — Opción 1 (moderna, con iconos) |
| `plan-basico-opcion-2` | Plan Básico — Opción 2 (clásica, más simple) |

### Estilos disponibles

| `ESTILO_FUENTE` | Descripción |
|---|---|
| `font-opcion-1` | Sans-serif moderna (por defecto) |
| `font-opcion-2` | Serif clásica |

| `ESTILO_COLOR` | Descripción |
|---|---|
| `color-opcion-1` | Azul (por defecto) |
| `color-opcion-2` | Verde |
| `color-opcion-3` | Oscuro / neutro |

---

## 9. Tenant Plugins

> Plugins de IA y automatización del tenant (chatbot, WhatsApp, email, etc.).

**Base:** `/api/tenant-plugins` — 🏠 Todos requieren `x-tenant-host`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/tenant-plugins/active` | 🏠 | Plugins activos (público — para el frontend) |
| `GET` | `/tenant-plugins` | 🏠🔐 | Todos los plugins con su config |
| `GET` | `/tenant-plugins/:key` | 🏠🔐 | Plugin específico por clave |
| `PATCH` | `/tenant-plugins/:key` | 🏠🔐 | Actualizar config o activar/desactivar plugin |

### Claves de plugins disponibles

| `plugin_key` | Descripción |
|---|---|
| `ai_chatbot` | Chatbot con IA (OpenAI / Anthropic / Gemini) |
| `langchain` | Agente LangChain con memoria y herramientas |
| `whatsapp` | Bot de WhatsApp (Twilio / Meta Cloud API) |
| `email` | Notificaciones por email (Resend / SendGrid) |

### `PATCH /tenant-plugins/ai_chatbot`
```json
{
  "isActive": true,
  "config": {
    "version": "1.0",
    "ai_chatbot": {
      "enabled": true,
      "provider": "openai",
      "model": "gpt-4o-mini",
      "api_key": "sk-...",
      "system_prompt": "Eres el asistente de Mi Empresa. Responde en español.",
      "temperature": 0.7,
      "max_tokens": 500,
      "streaming": false
    }
  }
}
```

---

## 10. Tenant Page

> Renderizado y assets del template del tenant.

**Base:** `/api/tenant-page` — 🏠 Todos requieren `x-tenant-host`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/tenant-page` | 🏠 | Landing page del tenant renderizada (HTML) |
| `GET` | `/tenant-page/templates` | 🏠 | Lista de templates disponibles en el servidor |
| `GET` | `/tenant-page/assets/:templateId/:filename` | 🏠 | Sirve CSS o JS del template |

### Assets por template

```
GET /api/tenant-page/assets/plan-basico-opcion-1/styles.css
GET /api/tenant-page/assets/plan-basico-opcion-1/script.js
GET /api/tenant-page/assets/plan-basico-opcion-2/styles.css
GET /api/tenant-page/assets/plan-basico-opcion-2/script.js
```

> Los paths de CSS y JS en el HTML renderizado ya apuntan automáticamente a estos endpoints.

---

## Flujos principales

### Flujo 1 — Crear tenant y configurar template

```
1. POST /auth/register          → Crear cuenta de plataforma
2. POST /auth/login             → Obtener JWT de plataforma
3. POST /hostnames              → Crear hostname del tenant (crea la BD automáticamente)
4. POST /tenant-users/register  → Crear usuario admin del tenant  (x-tenant-host requerido)
5. PUT  /tenant-config          → Configurar template y personalización (x-tenant-host + tenant JWT)
6. GET  /tenant-page            → Ver la landing page renderizada
```

### Flujo 2 — Editor de template (frontend admin)

```
1. POST /tenant-users/login     → Obtener tenant JWT
2. GET  /tenant-config/editor-data → Cargar campos actuales del editor
3. [usuario edita campos en el frontend]
4. PUT  /tenant-config          → Guardar cambios
5. GET  /tenant-page            → Vista previa actualizada
```

### Flujo 3 — Captura de lead desde la landing

```
1. GET  /tenant-page            → Visitante ve la landing (público)
2. POST /tenant-contacts        → Visitante envía formulario de contacto (público)
3. GET  /tenant-contacts        → Admin del tenant revisa los leads (tenant JWT)
4. PATCH /tenant-contacts/:id/status → Admin marca como leído/respondido
```

---

## Headers de referencia

| Header | Requerido en | Ejemplo |
|--------|-------------|---------|
| `Content-Type` | POST/PUT/PATCH | `application/json` |
| `Authorization` | Endpoints 🔑 y 🔐 | `Bearer eyJhbGci...` |
| `x-tenant-host` | Endpoints 🏠 | `x-tenant-host: mi-empresa` |

> **Nota:** El `Authorization` Bearer para endpoints 🔑 (plataforma) y 🔐 (tenant) son tokens **distintos** — se obtienen desde `/auth/login` y `/tenant-users/login` respectivamente.
