# WizyDoc API

Backend de WizyDoc construido con Fastify, Prisma y PostgreSQL.

## Requisitos

- Node.js >= 22
- pnpm
- PostgreSQL (local o remoto)

## Setup

### 1. Instalar dependencias

```bash
cd api
pnpm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/wizydoc
JWT_SECRET=tu-secret-seguro
PORT=4000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Crear la base de datos

```bash
docker run -d --name wizydoc-db -e POSTGRES_USER=wizydoc -e POSTGRES_PASSWORD=wizydoc -e POSTGRES_DB=wizydoc -p 5432:5432 -v wizydoc-pgdata:/var/lib/postgresql/data postgres:17-alpine
```

### 4. Correr migraciones

```bash
pnpm prisma:migrate
```

### 5. Generar el cliente de Prisma

```bash
pnpm prisma:generate
```

### 6. Levantar el servidor

```bash
pnpm dev
```

El servidor corre en `http://localhost:4000`. Tiene hot reload con `tsx watch`.

## Scripts

| Script                 | Descripción                                |
| ---------------------- | ------------------------------------------ |
| `pnpm dev`             | Levantar en modo desarrollo con hot reload |
| `pnpm build`           | Compilar TypeScript a `dist/`              |
| `pnpm start`           | Correr el build de producción              |
| `pnpm typecheck`       | Verificar tipos sin compilar               |
| `pnpm prisma:generate` | Generar el cliente de Prisma               |
| `pnpm prisma:migrate`  | Crear y correr migraciones                 |
| `pnpm prisma:push`     | Sincronizar schema a la DB sin migración   |
| `pnpm docker:build`    | Construir imagen Docker                    |
| `pnpm docker:run`      | Correr container con `.env`                |

## Docker

```bash
pnpm docker:build
pnpm docker:run
```

## Endpoints

### Auth

| Método | Ruta             | Descripción          |
| ------ | ---------------- | -------------------- |
| POST   | `/auth/register` | Registrar usuario    |
| POST   | `/auth/login`    | Iniciar sesión       |
| POST   | `/auth/refresh`  | Renovar access token |
| POST   | `/auth/logout`   | Cerrar sesión        |
| GET    | `/health`        | Health check         |
