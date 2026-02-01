# EIRL.PE Backend API Documentation

## Resumen de Implementación

Se completó la implementación del backend NestJS con autenticación JWT y los siguientes módulos:

### Estructura del Proyecto

```
src/
├── main.ts                    # Bootstrap de la aplicación
├── app.module.ts              # Módulo principal
├── entities/                  # Entidades TypeORM
│   ├── index.ts
│   ├── user.entity.ts
│   ├── hostname.entity.ts
│   ├── user-profile.entity.ts
│   └── available.entity.ts
├── auth/                      # Módulo de autenticación
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── decorators/
│   │   └── current-user.decorator.ts
│   └── dto/
│       ├── auth.dto.ts
│       └── create-user.dto.ts
├── database/
│   └── database.module.ts
├── hostnames/
│   ├── hostnames.module.ts
│   ├── hostnames.service.ts
│   └── hostnames.controller.ts
├── users/
│   ├── users.module.ts
│   ├── users.service.ts
│   └── users.controller.ts
├── user-profile/
│   ├── user-profile.module.ts
│   ├── user-profile.service.ts
│   ├── user-profile.controller.ts
│   └── dto/
│       └── update-user-profile.dto.ts
└── available/
    ├── available.module.ts
    ├── available.service.ts
    └── available.controller.ts
```

---

## Endpoints API

Base URL: `http://localhost:3000/api`

### Autenticación (`/api/auth`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Registro de usuario |
| POST | `/auth/login` | No | Inicio de sesión |
| GET | `/auth/profile` | JWT | Obtener perfil del usuario autenticado |
| GET | `/auth/hostnames/:userId` | JWT | Obtener hostnames del usuario |

#### POST `/auth/register`
```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "name": "Nombre Usuario",
  "userProfile": {
    "document": "12345678",
    "phone": "+51999999999",
    "company_name": "Mi Empresa",
    "address": "Av. Principal 123",
    "ruc_company": "20123456789",
    "hostname_id": "mi-empresa"
  }
}
```

#### POST `/auth/login`
```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "userProfile": {...}
  }
}
```

---

### Hostnames (`/api/hostnames`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/hostnames/check/:hostname` | No | Verificar disponibilidad de hostname |
| GET | `/hostnames` | JWT | Listar todos los hostnames |
| GET | `/hostnames/:id` | JWT | Obtener hostname por ID |
| POST | `/hostnames` | JWT | Crear nuevo hostname |
| DELETE | `/hostnames/:id` | JWT | Eliminar hostname |

#### GET `/hostnames/check/:hostname`
**Respuesta:**
```json
{
  "available": true,
  "hostname": "mi-empresa"
}
```

---

### Usuarios (`/api/users`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/users` | JWT | Listar todos los usuarios |
| GET | `/users/:id` | JWT | Obtener usuario por ID |
| DELETE | `/users/:id` | JWT | Eliminar usuario |

---

### Perfil de Usuario (`/api/user-profile`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/user-profile` | JWT | Listar todos los perfiles |
| GET | `/user-profile/me` | JWT | Obtener mis perfiles |
| GET | `/user-profile/:id` | JWT | Obtener perfil por ID |
| GET | `/user-profile/user/:userId` | JWT | Obtener perfiles por usuario |
| GET | `/user-profile/hostname/:hostnameId` | JWT | Obtener perfiles por hostname |
| PUT | `/user-profile/:id` | JWT | Actualizar perfil |
| DELETE | `/user-profile/:id` | JWT | Eliminar perfil |

#### PUT `/user-profile/:id`
```json
{
  "document": "87654321",
  "phone": "+51988888888",
  "companyName": "Nueva Empresa",
  "address": "Nueva Dirección",
  "rucCompany": "20987654321"
}
```

---

### Disponibilidad (`/api/available`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/available/check/:userId` | No | Verificar disponibilidad de usuario |
| GET | `/available` | JWT | Listar todos los registros |
| GET | `/available/me` | JWT | Obtener mi disponibilidad |
| GET | `/available/:id` | JWT | Obtener registro por ID |
| POST | `/available` | JWT | Establecer mi disponibilidad |
| POST | `/available/user/:userId` | JWT | Establecer disponibilidad de usuario |
| DELETE | `/available/:id` | JWT | Eliminar registro |

#### POST `/available`
```json
{
  "available": true
}
```

---

## Autenticación JWT

Todos los endpoints protegidos requieren el header:
```
Authorization: Bearer <token>
```

El token se obtiene al hacer login o registro.

---

## Variables de Entorno

Configurar en `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=eirl
DB_SCHEMA=eirl
NODE_ENV=development

JWT_SECRET=tu-clave-secreta-cambiar-en-produccion
JWT_EXPIRES_IN=24h
```

---

## Ejecución

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

---

## Archivos Creados/Modificados

### Creados:
- `src/main.ts` - Bootstrap de NestJS con CORS y ValidationPipe
- `src/database/database.module.ts` - Módulo global de base de datos
- `src/hostnames/hostnames.module.ts`
- `src/hostnames/hostnames.service.ts`
- `src/hostnames/hostnames.controller.ts`
- `src/users/users.module.ts`
- `src/users/users.service.ts`
- `src/users/users.controller.ts`
- `src/user-profile/user-profile.module.ts`
- `src/user-profile/user-profile.service.ts`
- `src/user-profile/user-profile.controller.ts`
- `src/user-profile/dto/update-user-profile.dto.ts`
- `src/available/available.module.ts`
- `src/available/available.service.ts`
- `src/available/available.controller.ts`

### Modificados:
- `src/auth/auth.module.ts` - Actualizado para usar TypeORM y ConfigService
- `src/auth/auth.service.ts` - Refactorizado para usar repositorios TypeORM
- `src/auth/strategies/jwt.strategy.ts` - Actualizado para usar repositorios
- `src/auth/dto/create-user.dto.ts` - Agregado campo ruc_company

---

## Seguridad

- Todas las contraseñas se hashean con bcrypt (10 rounds)
- JWT con expiración configurable (default: 24h)
- Validación de datos con class-validator
- CORS habilitado y configurable
- Guards de autenticación en endpoints protegidos
