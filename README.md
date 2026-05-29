# Menú QR Restaurante Premium

Web app premium para consumo dentro del local: menú QR, carrito, checkout por mesa y panel de cocina realtime con Supabase.

## Arquitectura

- **Frontend:** React + Vite + TailwindCSS.
- **Estado:** `useState` y Context API para carrito.
- **Backend:** Supabase Postgres.
- **Realtime:** Supabase Realtime con `postgres_changes` sobre `orders`.
- **Hosting:** Cloudflare Pages free tier.
- **Rutas:** `/` para clientes, `/kitchen` para cocina.

## Estructura

```bash
src/
  assets/
  components/
  context/
  hooks/
  lib/
  pages/
  services/
  styles/
supabase/
  schema.sql
  realtime.md
public/
  _redirects
```

## Requisitos

- Node.js 20 o superior.
- Cuenta gratuita de Supabase.
- Cuenta gratuita de Cloudflare.

## Levantar localmente

1. Instalá dependencias:

```bash
npm install
```

2. Copiá variables de entorno:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Completá `.env`:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

4. En Supabase, abrí SQL Editor y ejecutá `supabase/schema.sql`.

5. Iniciá Vite:

```bash
npm run dev
```

6. Abrí:

- Cliente: `http://localhost:5173`
- Cliente con mesa prellenada: `http://localhost:5173/?table=12`
- Cocina: `http://localhost:5173/kitchen`

## Supabase

La tabla `orders` guarda pedidos con estos campos de negocio:

```json
{
  "tableNumber": "",
  "customerName": "",
  "items": [],
  "total": 0,
  "notes": "",
  "status": "new",
  "createdAt": ""
}
```

En Postgres se usa snake_case:

- `table_number`
- `customer_name`
- `items`
- `total`
- `notes`
- `status`
- `created_at`

Los estados válidos son `new`, `preparing`, `ready` y `delivered`.

## Realtime

El schema agrega `orders` a la publicación `supabase_realtime` de forma idempotente. Más detalle en `supabase/realtime.md`.

## Deploy en Cloudflare Pages

1. Subí el repositorio a GitHub o GitLab.
2. En Cloudflare, entrá a **Workers & Pages > Create application > Pages**.
3. Conectá el repositorio.
4. Configurá:

```bash
Framework preset: Vite
Build command: npm run build
Build output directory: dist
```

5. Agregá variables de entorno en Cloudflare Pages:

```bash
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

6. Deploy.

`public/_redirects` mantiene funcionando `/kitchen` como ruta SPA en Cloudflare Pages.

## Producción

El panel `/kitchen` es funcional sin login para mantener el flujo simple y gratuito. Si el enlace de cocina va a estar expuesto fuera de la red del local, protegé cambios de estado con Supabase Auth o un Cloudflare Worker con validación de PIN y service role.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```
