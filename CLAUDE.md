# CLAUDE.md

Guía de contexto para que Claude Code trabaje sobre `zonaquintas-website` con la mínima fricción posible. Este archivo describe **lo que el repo realmente es hoy** (no una visión idealizada): qué hace, cómo está armado, qué dependencias externas tiene y dónde están los puntos delicados.

---

## 1. Qué es el proyecto

**ZonaQuintas** es el frontend web de un marketplace de alquiler temporario de quintas/casas de fin de semana en Argentina. Los usuarios pueden:

- Buscar quintas por ubicación, fechas, huéspedes y un set muy amplio de amenities (parrilla, piscina, jacuzzi, canchas, etc.).
- Ver el detalle de una quinta, su anfitrión y reservar.
- Pagar la **seña** y luego el **saldo** vía Rebill (pasarela de pagos AR).
- Publicar una quinta en un flujo de 4 pasos (`/publicar-quinta/paso-1..4`).
- Tener un **panel de admin**, una **billetera** propia, gestionar reservas, publicaciones, favoritos.
- Suscribirse a una **membresía premium** mensual recurrente (también vía Rebill).

El frontend es un **Next.js 16 App Router** + **TypeScript** + **Tailwind v4** + **shadcn/ui (style "new-york")**. **No hay base de datos local**: todo el estado persistente vive detrás de una API externa (FastAPI, según pistas en el código) consumida vía Axios.

---

## 2. Stack y versiones

- **Next.js**: `16.2.4` (App Router, RSC, `middleware.ts` en raíz).
- **React / React DOM**: `^19.0.0`.
- **TypeScript**: `^5`, `strict: true`. `target: ES2017`, `module: esnext`, `moduleResolution: bundler`.
- **Tailwind CSS**: v4 (vía `@tailwindcss/postcss`, sin `tailwind.config.*` — la configuración vive en `app/globals.css` con `@theme`).
- **shadcn/ui**: configurado en `components.json` (style `new-york`, baseColor `neutral`, alias `@/components`, `@/lib`). Sólo hay un componente UI generado hoy: `app/components/ui/Separator.tsx`.
- **Forms**: `react-hook-form`.
- **HTTP**: `axios` (`lib/axios.ts`) con `withCredentials: true` y un interceptor 401.
- **Maps**: `@googlemaps/js-api-loader` + `@googlemaps/markerclusterer` (clave pública en `.env`).
- **Galería de imágenes**: `lightgallery`.
- **Date picker**: `react-datepicker`.
- **Slider**: `rc-slider`.
- **Toasts**: `react-hot-toast`.
- **Email**: `resend` + `@react-email/components` (los templates viven en `app/components/emails/*`).
- **Pagos**: integración custom con la API de **Rebill** (`https://api.rebill.com/v3`) en `lib/rebill.ts` y rutas `app/api/memberships/*` + `app/api/webhook/rebill`.
- **Iconos**: `lucide-react` + un set propio en `app/components/icons/*` (mezcla de `.tsx` y `.jsx`).
- **Lock files**: hay **dos** — `package-lock.json` y `pnpm-lock.yaml`. **Mantenelos consistentes** (preguntar al usuario qué gestor prefiere antes de instalar/actualizar). Los scripts en `package.json` no asumen ninguno.

### Scripts (`package.json`)
- `dev` → `next dev`
- `build` → `next build`
- `start` → `next start`
- `lint` → `next lint`

No hay scripts de test ni de typecheck explícito (usá `npx tsc --noEmit` si querés validar tipos).

---

## 3. Estructura de carpetas (mapa mental)

```
app/
├── layout.tsx                  # Root layout: monta Header + Footer y los 3 Providers
├── page.tsx                    # Home: Form de búsqueda + Filters + QuintasFilters (listado destacado)
├── globals.css                 # Tailwind v4 + tema (@theme con --color-primary, primaryDark, tertiary)
│
├── (auth)/                     # Grupo de rutas que requieren sesión (cookie access_token)
│   ├── login/                  # ⚠ NO requiere auth — vive acá por organización, no por middleware
│   ├── register/               # idem login
│   ├── dashboard/              # Solo admins (redirect("/") si user.role !== "admin")
│   ├── my-account/
│   ├── publications/
│   ├── reservations/
│   ├── favorites/
│   └── wallet/
│
├── api/                        # Route handlers (Node runtime, no edge)
│   ├── memberships/
│   │   ├── subscribe/route.ts  # Crea payment-link tipo "plan" en Rebill + PATCH al backend
│   │   └── cancel/route.ts     # Cancela subscription en Rebill + PATCH al backend
│   ├── webhook/rebill/route.ts # Webhook de Rebill (eventos payment.created)
│   └── test-email/             # 6 endpoints, uno por template de Resend (probar emails)
│       ├── balance-confirmed/
│       ├── balance-pay-booking/
│       ├── confirmed-booking/
│       ├── contact/
│       ├── new-booking/
│       └── request-balance/
│
├── components/
│   ├── Header.tsx              # Header global con menú móvil + skeleton mientras loading
│   ├── Footer.tsx
│   ├── BookingSection.tsx      # Sidebar de reserva (calendario + precio + CTA)
│   ├── Calendar.tsx
│   ├── FormQuintas.tsx         # Form usado en publicar-quinta
│   ├── PlacesAutocomplete.tsx  # Google Places autocomplete
│   ├── StaticMap.tsx           # Mapa estático de Google Maps
│   ├── DashboardCard.tsx
│   ├── AddCharacteristics.jsx  # ⚠ JSX, no TSX
│   ├── AddLanguage.tsx
│   ├── Arrow.jsx               # ⚠ JSX
│   ├── CategorySection.jsx     # ⚠ JSX
│   ├── QuintaSearchCard.jsx    # ⚠ JSX
│   ├── SecondSeparator.jsx     # ⚠ JSX
│   ├── emails/                 # Templates @react-email para Resend
│   │   ├── BalanceConfirmed.tsx
│   │   ├── ContactoEmail.tsx
│   │   ├── LinkPayEmail.tsx
│   │   ├── NewBookingEmail.tsx
│   │   ├── PayBalanceEmail.tsx
│   │   └── RequestBalance.tsx
│   ├── home/                   # Componentes específicos de la home
│   │   ├── Form.tsx            # Buscador principal
│   │   ├── FormSkeleton.tsx
│   │   ├── Filters.tsx         # Filtros básicos visibles
│   │   ├── AllFilters.tsx      # Modal con TODOS los filtros (booleanos amenities)
│   │   ├── QuintasFilters.tsx  # Listado de quintas filtradas
│   │   └── QuintaCard.tsx
│   ├── quintas/                # Componentes específicos del detalle
│   │   ├── ImageGallery.tsx
│   │   ├── QuintasMap.tsx
│   │   └── QuintaSearchCardSkeleton.tsx
│   ├── icons/                  # SVGs como componentes (algunos .tsx, otros .jsx)
│   └── ui/Separator.tsx        # shadcn separator
│
├── context/
│   ├── UserContext.tsx         # user actual, loading, refetchUser. Hace AuthServices.me() en mount
│   ├── SearchContext.tsx       # place / dates / guests del buscador
│   ├── ContextFilters.tsx      # filtros amenities + función filtersQuintas() que filtra en memoria
│   └── QuintaFormContext.tsx   # Estado del wizard publicar-quinta (NO está montado en root layout)
│
├── services/                   # Capa de acceso a la API (envuelve apiClient axios)
│   ├── AuthServices.tsx        # login, register, me, getUserById, updateUser, logout
│   ├── BookingsServices.tsx    # CRUD reservas + payments + flujos finished/inDate
│   └── ProductsServices.tsx    # quintas (get/create/changeStatus), getOwnerById, getWallet
│
├── publicar-quinta/            # Wizard de 4 pasos. Tiene un layout propio que monta QuintaFormProvider
│   ├── layout.tsx
│   ├── page.tsx                # Landing del wizard
│   ├── paso-1/page.tsx         # Características numéricas y amenities
│   ├── paso-2/page.tsx         # Título, descripción, fotos, dirección
│   ├── paso-3/page.tsx         # Precio y moneda
│   └── paso-4/page.tsx         # Confirmación / submit
│
├── quintas/
│   ├── page.tsx                # Listado de resultados
│   └── [id]/
│       ├── page.tsx            # Detalle de quinta
│       ├── preview-reservation/
│       └── success/
│
├── membership/
│   ├── page.tsx
│   └── success/page.tsx
├── membresia/page.tsx          # ⚠ Coexisten /membership y /membresia (revisar duplicado)
├── my-membership/page.tsx
├── pay_ticket_rebill_success/page.tsx
├── cancelation/page.tsx
├── politics/page.tsx
├── terms/page.tsx
├── support/page.tsx
└── not-found/page.tsx          # ⚠ Esto es una *page*, NO el archivo especial app/not-found.tsx de Next

lib/
├── axios.ts                    # apiClient (axios.create) + interceptor 401
├── rebill.ts                   # createPaymentLinkRebill, createSubscriptionLinkRebill, getPaymentLinkRebill
├── resend.ts                   # export const resend = new Resend(process.env.RESEND_API_KEY)
└── utils.ts                    # cn() = twMerge(clsx(...))

middleware.ts                   # Protege rutas con cookie "access_token"
types.ts                        # ⚠ Tipos globales viven en raíz, NO en lib/types.ts. Importar como "@/types"
```

### Convenciones de import

`tsconfig.json` define dos paths:
- `"@/*": ["./*"]` — lo más usado. `@/types`, `@/lib/axios`, `@/app/services/AuthServices`.
- `"@/components": ["./components/*"]` — definido pero **no se usa**: los componentes están en `app/components/*` y se importan como `@/app/components/...`. (Este alias quedó de un intento de migración a la estructura raíz `components/` que recomienda shadcn — ojo si hacés `npx shadcn add`, instala en `components/` que no existe).

---

## 4. Tipos del dominio (`types.ts`)

Los modelos clave (todos en `types.ts` raíz):

- **`Quintas`**: la entidad central. Mezcla campos del listado (id, title, address, lat/long, price, currency, owner_id, status, main_image, images[]) con **~35 booleans** de amenities agrupados por categoría (habitaciones, limpieza personal, limpieza general, cocina, entretenimiento, estacionamiento, exterior). Estos booleans se usan idénticos en `Quintas`, en el filtro (`ContextFilters`) y en el form de publicación. Si agregás un amenity nuevo, hay que tocar **los tres lugares**.
  - `latitude` / `length` (sí, **`length` es la longitud**, no la altura/ancho — confuso pero así está; revisar `StaticMap.tsx`, `QuintasMap.tsx`, detalle de quinta).
- **`Users`**: incluye `rebill_customer_id`, `rebill_subscription_id`, `membership_status` (`active | inactive | cancelled | failed | pending`) y `membership_expires_at`. `password` está en el tipo (presumiblemente solo se envía en register/login).
- **`Booking`** y **`BookingPayments`**: separación reserva ↔ pago. Una reserva tiene **dos** pagos: `deposit` (seña) y `balance` (saldo). Cada `BookingPayments` guarda el `rebill_payment_link_id`, `rebill_payment_link_url` y `rebill_transaction_id`.
- **`PaymentLink`** / **`CreatePaymentLinkRequest`**: shape de la API Rebill v3.
- **`Wallet`**: `balances` con sub-objetos `retenido`, `disponible`, `entregado` (cada uno con `ARS` y `USD`) + `recent_transactions`.

Status codes que se repiten:
- Quinta status: `'active' | 'pending' | 'rejected' | 'cancelled'`
- Booking status: `'pending' | 'finished' | 'rejected' | 'cancelled' | 'accepted' | 'paid'`
- Payment status: `'pending' | 'finished' | 'rejected' | 'cancelled' | 'accepted' | 'paid'` (igual a booking)

---

## 5. Autenticación

- **No hay NextAuth, ni Clerk, ni Supabase Auth en este repo**. La auth se delega al backend FastAPI vía cookie HTTP `access_token`.
- `lib/axios.ts` configura `withCredentials: true` para que el navegador mande la cookie.
- El interceptor 401 limpia `localStorage` (`access_token`, `user`) y redirige a `/login` **sólo si la URL empieza con `/system`** — pero **no existe ninguna ruta `/system`** en el repo, así que efectivamente el redirect 401 nunca dispara. Probablemente herencia de una versión anterior. Si vas a corregirlo, alinealo con `protectedRoutes` de `middleware.ts`.
- `middleware.ts` protege estas rutas si la cookie `access_token` falta:
  - `/my-account`, `/reservations`, `/publications`, `/dashboard`, `/favorites`, `/wallet`, `/publicar-quinta/paso-1..4`.
  - El matcher en `config.matcher` redunda con la lista pero usa `/publicar-quinta/:path*` (cubre el wizard entero, incluido `/publicar-quinta` raíz).
- `UserContext` llama `AuthServices.me()` al montar y trae el user. **Importante**: hace dos requests (`me` → devuelve `current_user` (id) → `getUserById(id)`). Si optimizás esto, asegurate que el backend siga devolviendo `{ current_user: id }` en `/me`.
- El `dashboard` chequea `user?.role === "admin"` en cliente y redirige; **el backend tiene que validar también** — no confiar en el guard cliente.

---

## 6. Pagos (Rebill) — el corazón funcional del producto

Hay dos diagramas en el repo (`flujo-payments.png`, `fluyo_plan_rebill.png`) que documentan los flujos. Lo que está implementado:

### 6.1 Reservas (deposit + balance)
1. El usuario completa la reserva → backend crea `Booking` y un `BookingPayments` de `deposit`.
2. Frontend llama a `lib/rebill.ts:createPaymentLinkRebill` con `{ prices, reservaId, paymentId, paymentType: 'deposit', ownerId }` y guarda el link en `BookingPayments`.
3. El usuario paga en Rebill → Rebill manda webhook a `app/api/webhook/rebill/route.ts`.
4. El handler:
   - Si `payment.status === 'approved'` y `payment_type === 'deposit'`:
     - PATCH `booking-payments/{payment_id}` → `status: 'paid'`.
     - PATCH `bookings/{booking_id}/status` → `status: 'paid'`.
     - POST `api/emails/deposit-confirmed` (mail).
   - Si `payment_type === 'balance'`: marca `'finished'` en ambos y manda mail final.
   - Si `payment.status === 'rejected'` y hay `planId`: marca la membresía como `failed`.

### 6.2 Membresía (suscripción mensual)
- `app/api/memberships/subscribe/route.ts`: crea un payment-link **type `plan`** apuntando al `REBILL_PLAN_ID` y guarda `rebill_payment_link_id` con `membership_status: 'pending'`.
- Webhook (mismo route) detecta evento con `planId` + `user_id` y aprobado → PATCH `users/{id}/membership` con `membership_status: 'active'`, `rebill_subscription_id`, `rebill_customer_id`, `membership_expires_at: getNextMonth()`.
- `app/api/memberships/cancel/route.ts`: PATCH `subscriptions/{id}` en Rebill con `status: 'cancelled'` y refleja en backend.

### 6.3 Puntos críticos / deuda técnica conocida

- **`REBILL_API_KEY` está hardcodeado** como string literal en TRES lugares: `lib/rebill.ts:5`, `app/api/memberships/subscribe/route.ts:4`, `app/api/memberships/cancel/route.ts:4`. La línea de `process.env.REBILL_API_KEY` está comentada justo arriba en `lib/rebill.ts`. **Hay que pasarlo a env var antes de productivo** (la actual es de **prueba** según el comentario en `.env`).
- **`API_URL` hardcodeado** en `app/api/webhook/rebill/route.ts:5` a `http://localhost:8000`. Esto **no funciona en producción**. La línea con `process.env.NEXT_PUBLIC_API_URL` está comentada arriba.
- **Webhook sin verificación de firma**: el handler acepta cualquier POST con body válido. Cualquiera con la URL puede activar membresías o marcar bookings como pagados. Hay que sumar verificación HMAC/secret de Rebill antes de productivo.
- **Sin idempotencia**: si Rebill reenvía el mismo webhook, los PATCH se ejecutan dos veces. Considerar idempotency key por `payment.id` o `rebill_transaction_id`.
- **`url`** en `subscribe/route.ts:8` apunta a un túnel ngrok hardcodeado (`https://imido-curliest-cole.ngrok-free.dev`). Usado para los `redirectUrls`. En producción tiene que ser el dominio real.
- **`INTERNAL_SECRET`** se importa con `!` (`process.env.INTERNAL_SECRET!`) en `subscribe/route.ts` pero **nunca se usa**. Limpiar o usar.
- En `rebill.ts:51-56` los redirect URLs apuntan a `https://www.zonaquintas.com/...` (prod) hardcoded, con las versiones localhost comentadas. Mover a env var.

---

## 7. Variables de entorno

El `.env` actual contiene:

```
# NEXT_PUBLIC_API_URL=...   (comentada — por eso axios cae a http://localhost:8000)
RESEND_API_KEY=re_...
REBILL_API_KEY=sk_...       (de PRUEBA según el comment)
REBILL_PLAN_ID=test_pln_...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
```

⚠ **Crítico**: `.gitignore` ignora `.env*` (línea 34) — eso está bien — pero **el `.env` con claves reales fue copiado manualmente al WSL desde Windows**. **No commitear**. Si el `.env` original quedó en el historial de git de Windows, hay que rotar las claves (especialmente `REBILL_API_KEY` y `RESEND_API_KEY`).

Variables que el código espera y **no están definidas hoy**:
- `NEXT_PUBLIC_API_URL` (comentada en `.env`, hace que axios y los route handlers caigan a `localhost:8000`).
- `INTERNAL_SECRET` (referenciado en `subscribe/route.ts` pero no usado).
- `REBILL_WEBHOOK_SECRET` (no existe — falta agregar verificación de firma).

---

## 8. Backend (FastAPI) — endpoints que el frontend llama

El frontend asume que existe una API en `NEXT_PUBLIC_API_URL` con estos endpoints (deducidos de `services/*` y los route handlers):

**Auth** (`AuthServices`):
- `POST /login` → setea cookie `access_token`
- `POST /register`
- `POST /logout`
- `GET /me` → `{ current_user: id }`
- `GET /user_by_id?id={id}` → `Users`
- `PUT /user/{id}` → actualiza user

**Quintas** (`ProductsServices`):
- `GET /quintas`
- `GET /quintas/{id}`
- `POST /quintas` (multipart/form-data)
- `PATCH /quintas/{id}/status`
- `GET /quintas/getAddressFromQuintas`
- `GET /dashboard/{id}` (wallet)

**Bookings** (`BookingsServices`):
- `POST /bookings`
- `GET /bookings/owner/{id}`
- `PATCH /bookings/{id}/status`
- `POST /bookings/{id}/payments`
- `PATCH /booking-payments/{id}`
- `GET /getBookingsFinished`
- `GET /getBookingsInDate`

**Membresías y emails** (server-side, llamadas desde route handlers vía fetch):
- `PATCH /users/{id}/membership`
- `POST /api/emails/deposit-confirmed`
- `POST /api/emails/balance-confirmed`

(El `/api/emails/*` que llama el webhook NO existe en este repo — es del backend FastAPI, ojo con confundirlo con `app/api/test-email/*`.)

---

## 9. Estado en el cliente

Tres providers globales en `app/layout.tsx`:
- `FiltersProvider` — filtros del listado de quintas + función `filtersQuintas(quintas)` que **filtra en memoria** todo el array.
- `SearchProvider` — `{ place, dates, guests }` del buscador de la home.
- `UserProvider` — usuario logueado.

`QuintaFormProvider` está **en `publicar-quinta/layout.tsx`**, no en root, porque solo aplica al wizard.

⚠ **Patrón**: el filtrado de quintas se hace 100% en cliente (ver `ContextFilters.tsx:118-184`). Para volúmenes grandes esto va a doler — eventualmente moverlo al backend.

---

## 10. Tailwind y theming

- Tailwind v4 sin `tailwind.config.*`. La paleta custom vive en `app/globals.css` con `@theme`:
  - `--color-primary: #33ff33` (no se usa mucho)
  - `--color-primaryDark: #28a728` ✅ — el verde principal de la marca, usado en CTAs, header, focos, fills de SVG.
  - `--color-tertiary: #84b6f4`
- También define `.publicar` y `.publicar2` con backgrounds de `/bg-publicar.png`.
- Fuente: `Inter` cargada vía `next/font/google` y expuesta como `--font-geist-sans` (sí, la variable se llama "geist" pero la fuente es Inter — vestigio de la plantilla create-next-app).
- El `body` arranca con `mt-32` para compensar el header `fixed`. Ojo si tocás el alto del header.

---

## 11. ⚠ Cosas raras / gotchas

1. **Mezcla `.tsx` y `.jsx`** en `app/components/` (varios icons, `AddCharacteristics`, `Arrow`, `CategorySection`, `QuintaSearchCard`, `SecondSeparator`). Y `tsconfig.json:39` incluye explícitamente `app/components/home/Filters.jsx` (que **ya no existe** — fue migrado a `Filters.tsx`). Limpieza pendiente.
2. **`tsconfig.json` sucio**: línea 42 tiene `, "app/not-found"` adosado al final del array `include` y `.next/types/app/(auth)/login/page.tsx` referenciado a mano. Funciona pero es feo.
3. **`app/not-found/page.tsx` es una página normal**, no usa la convención de Next `app/not-found.tsx`. Si querés un 404 global tenés que crear `app/not-found.tsx` (sin carpeta).
4. **`/membership` y `/membresia` coexisten** — son rutas distintas para el mismo concepto. Probablemente una es legacy. Verificar antes de tocar.
5. **`length` significa longitud** en `Quintas` (longitud geográfica). No el shorthand de array. Buscar `quinta.length` en el código siempre se refiere a esto.
6. **`next.config.ts` está vacío** (solo el scaffold). No hay configuración de imágenes remotas (`images.remotePatterns`), no hay `output: 'standalone'`, etc. Si Next se queja por imágenes externas (ej. fotos de usuarios subidas a S3), hay que configurar acá.
7. **`README.md` es el placeholder de create-next-app**: no documenta nada específico. Esta `CLAUDE.md` es la fuente de verdad.
8. **Emails de test** (`app/api/test-email/*`): son rutas accesibles públicamente que envían correos reales. **No commitear con `to:` de tu email personal en producción** — hoy `contact/route.ts:18` envía a `totobarajas124@gmail.com`. Antes de prod hay que parametrizar destinatarios y/o proteger las rutas.
9. **CRLF/LF**: el repo original vive en `C:\Users\totob\OneDrive\...`. Cuando se accede desde WSL sin `core.autocrlf` configurado, `git status` muestra TODOS los archivos como modificados. **Trabajar en el clon en WSL `~/proyectos/zonaquintas-website` evita esto**. Si tenés que volver a editar desde Windows, configurá `core.autocrlf=true` en Windows o agregá `.gitattributes` con `* text=auto eol=lf`.

---

## 12. Cómo correr el proyecto

```bash
cd ~/proyectos/zonaquintas-website

# Elegir UN gestor de paquetes (preguntar al usuario antes — hay dos lockfiles)
npm install      # o
pnpm install

# El backend FastAPI tiene que estar corriendo en NEXT_PUBLIC_API_URL (default localhost:8000)
# Asegurate que el .env esté presente

npm run dev      # http://localhost:3000
```

Para probar el webhook de Rebill localmente hace falta un túnel (ngrok/cloudflared) — la URL hardcodeada en `subscribe/route.ts` (`imido-curliest-cole.ngrok-free.dev`) es de una sesión vieja, hay que generar una nueva y actualizar la línea (idealmente vía env var).

---

## 13. Branch y workflow git

- **Rama por defecto**: `master` (no `main`).
- Remoto: `https://github.com/ttttttomas/zonaquintas-website` (público según parece).
- Historial: ~25 commits, dueño único, sin PRs ni branches de feature en el remoto. Mensajes en español, formato libre (no convencional commits).
- El repo en Windows tenía una rama local `feature/bookings-rebill-resend-flow` con un solo cambio en `.gitignore` agregando `.blackboxcli/`. No está en remoto.

---

## 14. Memoria de trabajo / preferencias del usuario

- Usuario habla español rioplatense — responder en español por defecto.
- Trabaja desde Windows + WSL2 — preferir el clon en `~/proyectos/zonaquintas-website` para evitar problemas de CRLF y performance de `/mnt/c/`.
- El proyecto vive en OneDrive en Windows — **nunca** sugerir comandos que toquen `node_modules` o `.next` desde la carpeta sincronizada (OneDrive lo va a partir).

---

## 15. Quick wins / cosas para arreglar primero

Si el usuario te pide "limpieza" o "preparar para producción", arrancá por acá (en orden de criticidad):

1. **Mover `REBILL_API_KEY` a env var** (3 archivos). Rotar la clave si el `.env` viejo quedó en git history.
2. **Mover `API_URL` del webhook a env var** (`app/api/webhook/rebill/route.ts:5`).
3. **Verificar firma del webhook de Rebill** + idempotencia.
4. **Sacar la URL de ngrok hardcodeada** de `subscribe/route.ts:8`.
5. **Proteger o eliminar las rutas `app/api/test-email/*`** antes de prod.
6. **Limpiar `tsconfig.json`** (sacar referencia a `Filters.jsx` que no existe, normalizar `include`).
7. **Decidir un solo gestor de paquetes** y borrar el lockfile sobrante.
8. **Configurar `images.remotePatterns`** en `next.config.ts` cuando se sepan los dominios de las fotos.
9. **Resolver `/membership` vs `/membresia`** (consolidar en una ruta).
10. **Migrar los `.jsx` de `app/components/` a `.tsx`** o sacarlos del `include` del tsconfig si son intencionales.
