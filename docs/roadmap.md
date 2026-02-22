# 🐾 PetLog - ROADMAP 2026-2027
**Versión 1.1** | Actualizado: 22 de febrero 2026
**Objetivo final:** Convertir PetLog en la app #1 de registro de vida de mascotas en Latinoamérica (empezando por Panamá) y generar ingresos recurrentes vía Freemium + afiliados.

---

## 🎯 Visión General del Producto

**Nombre:** PetLog
**Tagline:** "La vida completa de tu mascota en un solo lugar"
**Modelo de negocio:** Freemium + Afiliados Amazon + (futuro) comisiones de reservas
**Usuarios objetivo:** Dueños de perros y gatos en Panamá (luego LATAM)
**Plataformas:** Web progresiva (actual) + App Nativa iOS/Android (mismo Supabase)

### Diferenciadores clave
- Pasaporte imprimible oficial con MRZ
- Badges visuales de vacunas (PNG reales)
- Onboarding épico con fun facts y colores de raza
- AI OCR de carnet de vacunas (fase avanzada)
- Directorio local de vets y groomers en Panamá

---

## 📋 REGLAS OBLIGATORIAS para el Programador Senior (Claude Code / Cursor / Windsurf)

1. **Tailwind CSS v4**
   - Solo `bg-linear-to-*` (nunca `bg-gradient-to-*`)
   - Prohibido valores arbitrarios: nada de `w-[420px]`, `h-[137px]`, etc.
   - Usar solo la escala definida en `@theme` (w-105, etc.)

2. **Astro + React**
   - Todo lo posible en `.astro` (Server-first)
   - React **solo** para islas interactivas con datos (charts, forms con realtime, etc.)
   - Nunca usar React para layouts estáticos

3. **TypeScript**
   - Strict mode siempre (`"strict": true`)
   - Interfaces en `src/types/`
   - Supabase types generados con `supabase gen types`

4. **Estructura de carpetas** (respetar siempre)
```
src/
├── components/     # .astro + React islands
├── layouts/
├── lib/            # utils, vaccine-badges, supabase client, etc.
├── pages/
├── types/
├── middleware.ts
public/
└── badges/         # PNGs de vacunas optimizados
```

5. **Git & PRs**
   - Branch: `feature/nombre` o `fix/nombre`
   - Conventional commits
   - Cada PR debe tener checklist de las reglas anteriores

6. **Base de datos**
   - Todas las columnas nuevas con `IF NOT EXISTS`
   - RLS (Row Level Security) activado siempre
   - Índices en columnas usadas en filtros frecuentes

7. **Performance**
   - Imágenes PNG de badges → optimizadas con TinyPNG antes de subir
   - Charts con Recharts (React islands)
   - SSR siempre que sea posible

---

## 🗓️ ROADMAP POR FASES

---

### Fase 0: MVP Estable — Deploy Real (1-2 semanas)
**Objetivo: que una persona real pueda registrarse, meter su perro y usarlo sin fricciones.**

**BD pendiente:**
```sql
ALTER TABLE pets ADD COLUMN IF NOT EXISTS color TEXT;
```

**Tareas técnicas:**
- [ ] Toast/feedback en todas las acciones (guardar, eliminar, error) — usar `sonner`
- [ ] Loading states en forms (deshabilitar botón al submit)
- [ ] Onboarding mínimo: cuando no hay mascota, mostrar pantalla de bienvenida antes del formulario vacío
- [ ] Revisar responsive en iPhone 12/15 y Android Chrome
- [ ] Corregir todos los `forest`, `cream-dark` legacy restantes por las variables nuevas del tema
- [ ] Deploy en dominio propio (sugerencia: `petlog.app` o `petlog.lat`)
- [ ] Google OAuth funcionando en producción (configurar callback URL de Vercel)
- [ ] Vercel Analytics activado (gratis, 1 línea)
- [ ] Documentar tablas en `docs/database.md`

**Milestone:** Cualquier persona puede entrar, crear su cuenta con Google, registrar su perro y navegar todo sin errores. ✅

---

### Fase 1: Onboarding Épico (1-2 semanas)
**Objetivo: que el primer uso sea memorable y genere retención.**

**Flujo:**
1. Login con Google → nueva cuenta detectada
2. Pantalla "¡Bienvenido! ¿Cómo se llama tu mascota?" (minimalista, solo el nombre)
3. Especie: Perro / Gato (ilustraciones)
4. Raza: dropdown con autocomplete → card desliza mostrando:
   - Descripción corta de la raza
   - 3 fun facts
   - Chips de colores típicos de la raza
5. Foto + fecha de nacimiento + color
6. "¡Listo! El pasaporte de {nombre} está creado" + animación confeti
7. → Dashboard con datos pre-populados de ejemplo (o vacío con empty states motivadores)

**DB:**
```sql
CREATE TABLE IF NOT EXISTS breeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  species TEXT NOT NULL DEFAULT 'dog',
  description TEXT,
  fun_facts JSONB,
  typical_colors TEXT[]
);
```

**Milestone:** Tasa de completar onboarding > 80%. Medir con Supabase Analytics.

---

### Fase 2: Multi-Mascota (1-2 semanas)
**Objetivo: usuarios con más de un perro/gato pueden usarlo.**

**Cambios:**
- Selector de mascota activa en el sidebar
- Dashboard, todas las páginas internas y pasaporte filtran por `active_pet_id` (guardado en cookie/session)
- Límite: plan gratuito = 1 mascota, Premium = ilimitadas (plantar la semilla aquí)

**DB:**
```sql
-- pets ya tiene user_id, no hay cambio de esquema
-- Solo lógica de UI/UX
```

**Milestone:** Un usuario con 2 perros puede alternar entre ellos sin perder datos.

---

### Fase 3: Freemium + Primer Pago (2-3 semanas)
**Objetivo: generar el primer dólar real.**

**Plan gratuito:**
- 1 mascota
- Hasta 10 registros por sección
- Pasaporte básico (sin exportar PDF)
- Badges básicos

**Plan Premium — US$ 4.99/mes o US$ 39/año:**
- Mascotas ilimitadas
- Registros ilimitados
- Exportar PDF completo del pasaporte
- Charts avanzados de peso
- Sin límites en aventuras y fotos
- Soporte prioritario

**Implementación:**
- Lemon Squeezy (más simple que Stripe para LATAM sin LLC)
- Tabla `subscriptions` + webhook handler en `/api/webhooks/lemon`
- Middleware que chequea `plan` antes de operaciones premium

**Milestone:** Primer pago real recibido de alguien que no es tú.

---

### Fase 4: Engagement & Monetización Afiliados (2-3 semanas)

- Sistema de logros (`user_badges`): "Vacuna Master", "Grooming Pro", "Viajero Frecuente", etc.
- Sección "Productos recomendados para tu raza" con links de Amazon Affiliates
- Recomendaciones básicas por raza (con disclaimer veterinario)
- Compartir tarjeta de perfil de mascota (link público `/p/[slug]`)

**Milestone:** Primer click de afiliado registrado. Primera tarjeta compartida en Instagram.

---

### Fase 5: App Nativa iOS + Android (4-6 semanas)

**Decisión técnica recomendada: Expo + React Native**
- Mismo Supabase client que la web
- Monorepo con Turborepo (compartir `types/` y `lib/`)
- Push notifications para recordatorios de vacunas y citas
- Web → PWA ya existe como puente

*Alternativa más rápida pero menos nativa: Capacitor sobre la web actual.*

**Milestone:** App publicada en App Store y Play Store. 100 descargas primer mes.

---

### Fase 6: Directorio Local Panamá (1-2 semanas)

**DB:**
```sql
CREATE TABLE IF NOT EXISTS service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'vet' | 'groomer'
  address TEXT,
  phone TEXT,
  latitude FLOAT,
  longitude FLOAT,
  rating FLOAT,
  photo_url TEXT,
  website TEXT
);
```

- Pantalla "Vets cerca de mí" (mapa con Mapbox o Google Maps embed + lista)
- "Groomers recomendados en Panamá"
- Botón "Llamar" y "WhatsApp directo"

**Milestone:** 20 vets y 10 groomers de Panamá cargados manualmente.

---

### Fase 7: AI — OCR de Carnet de Vacunas (2-3 semanas)
*(Solo ejecutar si hay > 100 usuarios activos o un sponsor)*

- Foto del carnet físico de vacunas
- Claude Vision o GPT-4o Vision para extraer: vacuna, fecha, veterinario
- Prellenar formulario automáticamente
- Confirmar antes de guardar

**Milestone:** OCR con > 85% de precisión en carnets panameños.

---

### Fase 8: AI — Reconocimiento de Comida (3-4 semanas)
*(Solo ejecutar si hay plan Premium activo con > 50 suscriptores)*

- Foto del plato o bolsa de comida
- Detectar: marca, tipo (croqueta, húmedo, BARF), calorías estimadas
- Prellenar historial nutricional
- Recomendaciones por raza/peso

---

### Fase 9: Reservas Online (Q4 2026)

- Calendario de vets/groomers (Calendly embed o API propia)
- Comisión por reserva confirmada
- Recordatorio automático por email/push

---

### Fase 10: Expansión LATAM (2027)

- i18n (español → inglés + portugués)
- Feed social de aventuras (comunidad)
- Pet Insurance affiliate (Figo, Petplan)
- Versión B2B para clínicas veterinarias

---

## 📊 KPIs a seguir desde Fase 0

| Métrica | Fase 0 meta | Fase 3 meta |
|---------|------------|------------|
| Usuarios registrados | 10 (beta) | 200 |
| Retención día 7 | — | > 40% |
| Completar onboarding | — | > 80% |
| Suscriptores Premium | 0 | 5 |
| MRR | $0 | $25 |
