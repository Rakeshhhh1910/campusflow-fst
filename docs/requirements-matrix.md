# Requirements Matrix — CampusFlow

**Course:** Fullstack Development with NextJs (DJS23AMD302 / DJS23AMD302L)
**Project:** CampusFlow — Student Service & Activity Management Platform
**Documents:** Assignments.docx + FST_Self Learning Plan_template.docx

> This matrix was completed BEFORE any implementation began.
> Every requirement from both documents is listed here.

---

## ASSIGNMENT 1 — PART A: Accessible Primitive Integration & Hydration Boundary

| Req ID | Source | Requirement | Implementation | File(s) | Technology | How to Demonstrate | Deliverable |
|--------|--------|-------------|----------------|---------|------------|-------------------|-------------|
| A1-PA-01 | Assignments.docx | Use Next.js App Router | All pages in app/ directory | `app/` | Next.js 14+ App Router | Inspect folder structure | Source code |
| A1-PA-02 | Assignments.docx | Use TypeScript | All .ts/.tsx files | All source files | TypeScript | `npm run typecheck` | Type-check output |
| A1-PA-03 | Assignments.docx | Configure Tailwind CSS | tailwind.config.ts + globals.css | `tailwind.config.ts`, `app/globals.css` | Tailwind CSS | Inspect rendered classes | Config file |
| A1-PA-04 | Assignments.docx | Configure shadcn/ui | components.json + components/ui/ | `components.json`, `components/ui/` | shadcn/ui | Show components | components/ui/ |
| A1-PA-05 | Assignments.docx | Radix UI through shadcn | Dialog, Select, Dropdown | `components/ui/dialog.tsx` etc. | Radix UI | Keyboard navigation | UI demo |
| A1-PA-06 | Assignments.docx | Accessible UI components | Semantic HTML, aria, keyboard nav | All UI files | Radix/shadcn | Keyboard-only navigation | Viva demo |
| A1-PA-07 | Assignments.docx | Theme switching Light/Dark/System | ThemeProvider + ThemeToggle | `components/providers/theme-provider.tsx` | next-themes | Click toggle | UI demo |
| A1-PA-08 | Assignments.docx | Prevent layout shifts from themes | suppressHydrationWarning + CSS vars | `app/layout.tsx` | next-themes + Tailwind | Lighthouse CLS=0 | Lighthouse |
| A1-PA-09 | Assignments.docx | Prevent hydration mismatch | mounted check on ThemeToggle | `components/ui/theme-toggle.tsx` | React + next-themes | Browser console: no warnings | Console screenshot |
| A1-PA-10 | Assignments.docx | Separate RSC and Client Components | RSC fetches data; CC handles interaction | `app/**/page.tsx` vs `components/**/*.tsx` | Next.js RSC | Code review | Source code |
| A1-PA-11 | Assignments.docx | 'use client' only where genuinely required | Count 'use client' < 30% of files | Interactive files only | Next.js | grep 'use client' | Code review |
| A1-PA-12 | Assignments.docx | RSC → Client hydration boundary demo | Server page passes props to CC | `app/activities/[id]/page.tsx` → CC | Next.js RSC | Inspect props | Source + runtime |
| A1-PA-13 | Assignments.docx | Serializable props across boundary | Only primitives/plain objects passed | Activity detail page | Next.js | TypeScript types of props | Source code |
| A1-PA-14 | Assignments.docx | Majority data fetching server-side | Prisma queries in RSC | `app/**/page.tsx`, `lib/db/` | Prisma + RSC | Network tab: no redundant client calls | DevTools |
| A1-PA-15 | Assignments.docx | Code comments: RSC/CC boundaries | Inline comments on every component | All component files | TypeScript | Read source | Source review |
| A1-PA-16 | Assignments.docx | docs/rsc-hydration.md | Markdown doc on RSC/hydration | `docs/rsc-hydration.md` | Markdown | Open file | docs/rsc-hydration.md |
| FST-T1-01 | FST Template | shadcn/ui copy-paste philosophy | Components in components/ui/ | `components/ui/` | shadcn/ui | Show no heavy lib dependency | Source |
| FST-T1-02 | FST Template | Radix + Tailwind styling | cn() utility + Tailwind classes | `lib/utils.ts` | Radix + Tailwind | Inspect DOM | Source |
| FST-T1-03 | FST Template | next-themes theme management | ThemeProvider wrapping layout | `app/layout.tsx` | next-themes | Toggle; no flash | UI demo |
| FST-T1-04 | FST Template | Reusable UI Component Sandbox | All components used across pages | `components/ui/*` | shadcn/ui | Navigate pages | Source |
| FST-T1-05 | FST Template | Summary Sheet deliverable | docs/rsc-hydration.md | `docs/rsc-hydration.md` | Markdown | Open doc | Report |

## ASSIGNMENT 1 — PART B: Zustand Client State Management

| Req ID | Source | Requirement | Implementation | File(s) | Technology | How to Demonstrate | Deliverable |
|--------|--------|-------------|----------------|---------|------------|-------------------|-------------|
| A1-PB-01 | Assignments.docx | Implement Zustand | Zustand store for activity cart | `store/activity-store.ts` | Zustand | React DevTools | Source + demo |
| A1-PB-02 | Assignments.docx | Persistent Zustand store | persist middleware + localStorage | `store/activity-store.ts` | Zustand + persist | Page refresh; cart persists | DevTools → localStorage |
| A1-PB-03 | Assignments.docx | selectedActivities slice | Array of activity objects | `store/activity-store.ts` | Zustand | React DevTools | Source |
| A1-PB-04 | Assignments.docx | addActivity() action | Adds to selection if not present | `store/activity-store.ts` | Zustand | Click "Add to My Activities" | UI demo |
| A1-PB-05 | Assignments.docx | removeActivity() action | Removes from selection | `store/activity-store.ts` | Zustand | Click remove | UI demo |
| A1-PB-06 | Assignments.docx | clearActivities() action | Clears all selected | `store/activity-store.ts` | Zustand | Click clear all | UI demo |
| A1-PB-07 | Assignments.docx | isSelected() selector | Returns boolean | `store/activity-store.ts` | Zustand | Button state | UI demo |
| A1-PB-08 | Assignments.docx | Don't put all state in Zustand | Server state in RSC; Zustand for cart only | Documented architecture | Design | Code review | docs/state-management.md |
| A1-PB-09 | Assignments.docx | Avoid unnecessary re-renders (selectors) | useStore with selector function | `components/activities/ActivityCard.tsx` | Zustand selectors | React DevTools Profiler | Profiler |
| A1-PB-10 | Assignments.docx | Server layouts not converted to CC | ZustandProvider pattern | `app/layout.tsx` (no 'use client') | Zustand + Next.js | Check layout.tsx | Source |
| A1-PB-11 | Assignments.docx | docs/state-management.md | Zustand rationale + persistence + selectors | `docs/state-management.md` | Markdown | Open file | docs/state-management.md |
| FST-T2-01 | FST Template | Server State vs Client State | Documented separation | `docs/state-management.md` | Architecture | Open doc | Survey Report |
| FST-T2-02 | FST Template | Persistent stores (cart) | Activity cart with persist | `store/activity-store.ts` | Zustand persist | Refresh; persists | localStorage |
| FST-T2-03 | FST Template | Prevent unnecessary re-renders | Selector pattern | `components/activities/ActivityCard.tsx` | Zustand selectors | Profiler | Demo |
| FST-T2-04 | FST Template | 2-3 Page Survey Report + Store Example | docs/state-management.md | `docs/state-management.md` | Markdown | Open file | Survey |

## ASSIGNMENT 1 — PART C: Type-Safe Form Mutations

| Req ID | Source | Requirement | Implementation | File(s) | Technology | How to Demonstrate | Deliverable |
|--------|--------|-------------|----------------|---------|------------|-------------------|-------------|
| A1-PC-01 | Assignments.docx | react-hook-form | useForm hook in form component | `components/forms/ServiceRequestForm.tsx` | react-hook-form | Submit form | UI demo |
| A1-PC-02 | Assignments.docx | @hookform/resolvers/zod | zodResolver in useForm | `components/forms/ServiceRequestForm.tsx` | @hookform/resolvers/zod | Inline Zod errors | UI demo |
| A1-PC-03 | Assignments.docx | Shared Zod schema (serviceRequestSchema) | Single schema file for client + server | `lib/validations/service-request.ts` | Zod | Import in both form and action | Source |
| A1-PC-04 | Assignments.docx | Fields: title, category, description, priority | All fields with validation rules | `lib/validations/service-request.ts` | Zod | Submit empty form | UI demo |
| A1-PC-05 | Assignments.docx | Client-side Zod validation | zodResolver validates on blur/submit | `components/forms/ServiceRequestForm.tsx` | RHF + Zod | Submit invalid form | UI demo |
| A1-PC-06 | Assignments.docx | Server Action with 'use server' | Native Next.js Server Action | `app/actions/service-requests.ts` | Next.js Server Actions | Network tab: no AJAX | DevTools |
| A1-PC-07 | Assignments.docx | Server re-validates with shared schema | safeParse() server-side | `app/actions/service-requests.ts` | Zod | Send bad payload | Server log |
| A1-PC-08 | Assignments.docx | Sanitize/normalize data | trim(), lowercase | `app/actions/service-requests.ts` | TypeScript | Check DB values | DB query |
| A1-PC-09 | Assignments.docx | Verify authenticated session | auth() call before mutation | `app/actions/service-requests.ts` | Better Auth | Log out; try action → 401 | Response |
| A1-PC-10 | Assignments.docx | Database mutation | Prisma.create() for ServiceRequest | `app/actions/service-requests.ts` | Prisma | Check DB after submission | DB screenshot |
| A1-PC-11 | Assignments.docx | Create audit record | AuditLog.create() in same call | `app/actions/service-requests.ts` | Prisma | Query audit_logs | DB screenshot |
| A1-PC-12 | Assignments.docx | Return structured result | { success, data?, error? } | `app/actions/service-requests.ts` | TypeScript | Console.log result | Source |
| A1-PC-13 | Assignments.docx | Accessible validation errors | aria-describedby, role=alert | `components/forms/ServiceRequestForm.tsx` | ARIA | Screen reader | UI demo |
| A1-PC-14 | Assignments.docx | Loading/pending UI | useTransition pending state | `components/forms/ServiceRequestForm.tsx` | React | Submit; see spinner | UI demo |
| A1-PC-15 | Assignments.docx | React Suspense for async sections | Suspense around data-fetching | `app/requests/page.tsx` etc. | React Suspense | Throttle network | UI demo |
| A1-PC-16 | Assignments.docx | Optimistic UI | useOptimistic for request list | `components/requests/RequestList.tsx` | React useOptimistic | Add item; immediate UI update | UI demo |
| A1-PC-17 | Assignments.docx | Error toast notifications | Sonner toast on error | `components/forms/ServiceRequestForm.tsx` | Sonner | Trigger error | UI demo |
| A1-PC-18 | Assignments.docx | Success toast notifications | Sonner toast on success | `components/forms/ServiceRequestForm.tsx` | Sonner | Submit valid form | UI demo |
| A1-PC-19 | Assignments.docx | docs/server-actions.md | Server Action documentation | `docs/server-actions.md` | Markdown | Open file | docs/server-actions.md |
| FST-T3-01 | FST Template | Reusable Zod schemas for client+server | serviceRequestSchema + activityRegistrationSchema | `lib/validations/` | Zod | Import in form and action | Source |
| FST-T3-02 | FST Template | RHF with zodResolver | FormProvider + useForm + zodResolver | `components/forms/` | RHF + Zod | Form validation | UI demo |
| FST-T3-03 | FST Template | Inline form error states | FieldError under each input | `components/forms/` | RHF | Submit invalid | UI demo |
| FST-T3-04 | FST Template | Validate payloads inside Server Actions | safeParse on server | `app/actions/` | Zod | Server rejects bad payload | Server log |
| FST-T3-05 | FST Template | Validated Interactive Form Component | Service request form end-to-end | `app/requests/new/page.tsx` | Full stack | Submit form | UI + DB demo |

## ASSIGNMENT 1 — WEB VITALS & PERFORMANCE

| Req ID | Source | Requirement | Implementation | File(s) | Technology | How to Demonstrate | Deliverable |
|--------|--------|-------------|----------------|---------|------------|-------------------|-------------|
| A1-WV-01 | Assignments.docx | LCP optimization | next/image, preload fonts, RSC rendering | `app/page.tsx`, `next.config.ts` | Next.js Image | Lighthouse LCP | Report |
| A1-WV-02 | Assignments.docx | CLS optimization | Skeleton placeholders + image dimensions + font-display:swap | `components/ui/skeleton.tsx`, `globals.css` | CSS + Next.js | Lighthouse CLS | Report |
| A1-WV-03 | Assignments.docx | INP optimization | Minimal JS client components | Component architecture | React | Lighthouse INP | Report |
| A1-WV-04 | Assignments.docx | Avoid unnecessary client components | <30% files with 'use client' | All components | Next.js | grep count | Source |
| A1-WV-05 | Assignments.docx | Avoid huge client bundles | Dynamic imports + tree-shaking | `next.config.ts` | Next.js | Bundle analyzer | Bundle |
| A1-WV-06 | Assignments.docx | Avoid layout shifts | Skeleton + CSS vars | Skeleton components | CSS | CLS=0 | Lighthouse |
| A1-WV-07 | Assignments.docx | /performance page | Performance documentation page | `app/(public)/performance/page.tsx` | Next.js RSC | Navigate | UI |
| A1-WV-08 | Assignments.docx | docs/performance.md | Lighthouse instructions + Web Vitals explanation | `docs/performance.md` | Markdown | Open file | docs/performance.md |
| FST-T6-01 | FST Template | Dynamic OG images using @vercel/og | ImageResponse in route handlers | `app/opengraph-image.tsx`, `app/activities/[id]/opengraph-image.tsx` | @vercel/og | Open OG image URL | Image |
| FST-T6-02 | FST Template | Measuring Core Web Vitals | /performance page + Lighthouse | `docs/performance.md` | Lighthouse | Run audit | Audit report |
| FST-T6-03 | FST Template | Google Lighthouse auditing | Instructions in docs | `docs/performance.md` | Lighthouse | `npx lighthouse` | Report |
| FST-T6-04 | FST Template | Lighthouse Audit Report + Dynamic OG Link | docs/assignment-1-report.md | `docs/assignment-1-report.md` | Markdown | Open report | Report |

## ASSIGNMENT 1 — ACCESSIBILITY

| Req ID | Source | Requirement | Implementation | File(s) | Technology | How to Demonstrate | Deliverable |
|--------|--------|-------------|----------------|---------|------------|-------------------|-------------|
| A1-AX-01 | Assignments.docx | Semantic HTML | main, nav, header, section, article | All layouts | HTML5 | Inspect DOM | Source |
| A1-AX-02 | Assignments.docx | Accessible labels | label for inputs, aria-label for icons | All forms, nav | ARIA | Screen reader | UI demo |
| A1-AX-03 | Assignments.docx | Keyboard navigation | Tab order, Enter/Space on buttons | All interactive | HTML | Tab through UI | UI demo |
| A1-AX-04 | Assignments.docx | Proper focus states | focus-visible ring styles | `globals.css`, focusable elements | CSS | Tab; see focus ring | UI demo |
| A1-AX-05 | Assignments.docx | Accessible dialogs/dropdowns | Radix Dialog with roles | `components/ui/dialog.tsx` | Radix UI | Escape closes dialog | UI demo |
| A1-AX-06 | Assignments.docx | Accessible form errors | aria-describedby + role=alert | `components/forms/` | ARIA | Screen reader announces error | UI demo |
| A1-AX-07 | Assignments.docx | Meaningful button labels | Descriptive text or aria-label | All buttons | HTML/ARIA | Inspect buttons | Source |
| A1-AX-08 | Assignments.docx | Color contrast WCAG AA | CSS variables with sufficient contrast | `globals.css` | CSS | Lighthouse accessibility | Audit |
| A1-AX-09 | Assignments.docx | ARIA only where needed | No decorative ARIA | All components | ARIA | Code review | Source |

## ASSIGNMENT 1 — DYNAMIC OG IMAGES

| Req ID | Source | Requirement | Implementation | File(s) | Technology | How to Demonstrate | Deliverable |
|--------|--------|-------------|----------------|---------|------------|-------------------|-------------|
| A1-OG-01 | Assignments.docx | Dynamic OG for homepage | opengraph-image.tsx at root | `app/opengraph-image.tsx` | @vercel/og | Share homepage | OG preview |
| A1-OG-02 | Assignments.docx | Dynamic OG for activity detail | opengraph-image.tsx in [id] route | `app/activities/[id]/opengraph-image.tsx` | @vercel/og | Share activity URL | OG preview |
| A1-OG-03 | Assignments.docx | Dynamic OG for service request page | opengraph-image.tsx in requests | `app/requests/opengraph-image.tsx` | @vercel/og | Share request URL | OG preview |
| A1-OG-04 | Assignments.docx | OG image with CampusFlow + dynamic content | Title/activity in generated image | All opengraph-image.tsx | @vercel/og | View generated image URL | Browser |

## ASSIGNMENT 2 — PART A: Prisma + PostgreSQL + Seeding

| Req ID | Source | Requirement | Implementation | File(s) | Technology | How to Demonstrate | Deliverable |
|--------|--------|-------------|----------------|---------|------------|-------------------|-------------|
| A2-PA-01 | Both | Prisma ORM | Prisma client for all DB ops | `lib/prisma/client.ts`, `prisma/schema.prisma` | Prisma | `prisma studio` | DB schema |
| A2-PA-02 | Both | PostgreSQL | DATABASE_URL → PostgreSQL | `.env`, schema.prisma | PostgreSQL | psql connection | DB demo |
| A2-PA-03 | Assignments.docx | Normalized multi-entity schema | 7+ entities with proper relations | `prisma/schema.prisma` | Prisma | Show schema | Schema file |
| A2-PA-04 | Assignments.docx | User entity | id, email, name, role, createdAt | `prisma/schema.prisma` | Prisma | Query users | DB demo |
| A2-PA-05 | Assignments.docx | Role entity/enum | ADMIN, MEMBER, GUEST | `prisma/schema.prisma` | Prisma | Query roles | DB demo |
| A2-PA-06 | Assignments.docx | ServiceRequest entity | id, title, category, description, priority, status, userId | `prisma/schema.prisma` | Prisma | Query requests | DB demo |
| A2-PA-07 | Assignments.docx | Activity entity | id, title, description, date, capacity | `prisma/schema.prisma` | Prisma | Query activities | DB demo |
| A2-PA-08 | Assignments.docx | ActivityRegistration entity | id, activityId, userId, registeredAt | `prisma/schema.prisma` | Prisma | Query registrations | DB demo |
| A2-PA-09 | Assignments.docx | AuditLog entity | id, action, userId, resource, metadata | `prisma/schema.prisma` | Prisma | Query audit_logs | DB demo |
| A2-PA-10 | Assignments.docx | NotificationEvent entity | id, type, userId, status, sentAt | `prisma/schema.prisma` | Prisma | Query notifications | DB demo |
| A2-PA-11 | Assignments.docx | PKs, FKs, indexes, timestamps, uniques | @id, @relation, @@index, createdAt/updatedAt | `prisma/schema.prisma` | Prisma | Show schema | Schema |
| A2-PA-12 | Assignments.docx | Enum fields | RequestStatus, RequestPriority, UserRole | `prisma/schema.prisma` | Prisma | Show enums | Schema |
| A2-PA-13 | FST Template | prisma/seed.ts with @faker-js/faker | Realistic localized dummy data | `prisma/seed.ts` | Faker.js | Run seed; check DB | Terminal logs |
| A2-PA-14 | FST Template | Seed users with roles | ADMIN, MEMBER, GUEST seeded | `prisma/seed.ts` | Faker.js | Query users | DB screenshot |
| A2-PA-15 | FST Template | Seed activities | 20+ realistic activities | `prisma/seed.ts` | Faker.js | Query activities | DB screenshot |
| A2-PA-16 | FST Template | Seed service requests | 30+ requests across users | `prisma/seed.ts` | Faker.js | Query requests | DB screenshot |
| A2-PA-17 | FST Template | Seed registrations, audit logs, notifications | All entities with FK integrity | `prisma/seed.ts` | Faker.js | Query all tables | DB screenshot |
| A2-PA-18 | Assignments.docx | CLI workflow: reset + migrate + seed | `npm run db:setup` | `package.json` | npm scripts | Run db:setup | Terminal |
| A2-PA-19 | Assignments.docx | docs/database.md | DB setup documentation | `docs/database.md` | Markdown | Open file | docs/database.md |

## ASSIGNMENT 2 — AUTHENTICATION & AUTHORIZATION

| Req ID | Source | Requirement | Implementation | File(s) | Technology | How to Demonstrate | Deliverable |
|--------|--------|-------------|----------------|---------|------------|-------------------|-------------|
| A2-AU-01 | Assignments.docx | Better Auth | auth() with Prisma adapter | `lib/auth/auth.ts`, `app/api/auth/[...betterauth]/route.ts` | Better Auth | Sign in/out flow | Auth demo |
| A2-AU-02 | Assignments.docx | Session management | Session cookie + server session | `lib/auth/auth.ts` | Better Auth | Show session in action | Demo |
| A2-AU-03 | Assignments.docx | User roles: ADMIN, MEMBER, GUEST | Role field + middleware check | `prisma/schema.prisma`, `middleware.ts` | Better Auth + Prisma | Try admin route as MEMBER | 403 |
| A2-AU-04 | Assignments.docx | Next.js middleware authorization | middleware.ts checks session + role | `middleware.ts` | Next.js middleware | Access /admin as MEMBER | Redirect |
| A2-AU-05 | Assignments.docx | Protect /dashboard | Redirect unauthenticated | `middleware.ts` | Next.js | Access without session | Redirect |
| A2-AU-06 | Assignments.docx | Protect /admin | Requires ADMIN role | `middleware.ts` | Next.js | Access as MEMBER | 403 |
| A2-AU-07 | Assignments.docx | Protect /api/requests | Session check in handler | `app/api/requests/route.ts` | Next.js | Call without auth | 401 |
| A2-AU-08 | Assignments.docx | Protect /api/admin/* | ADMIN role check | `app/api/admin/route.ts` | Next.js | Call as MEMBER | 403 |
| A2-AU-09 | Assignments.docx | Protected GET endpoint | GET /api/requests with session | `app/api/requests/route.ts` | Next.js Route Handler | curl without token | 401 |
| A2-AU-10 | Assignments.docx | Protected POST endpoint | POST /api/requests with session | `app/api/requests/route.ts` | Next.js Route Handler | curl without token | 401 |
| A2-AU-11 | Assignments.docx | Admin-only endpoint | GET/POST /api/admin/* | `app/api/admin/users/route.ts` | Next.js Route Handler | curl as MEMBER | 403 |
| A2-AU-12 | Assignments.docx | Server Actions: independent auth check | auth() in every protected action | `app/actions/` | Better Auth | Source review | Code |
| A2-AU-13 | Assignments.docx | Server Actions: role check | user.role before mutation | `app/actions/` | Better Auth + Prisma | Wrong role → rejected | Server log |
| A2-AU-14 | Assignments.docx | Never trust client-provided IDs/roles | Identity from session only | `app/actions/`, `app/api/` | Better Auth | Code review | Source |

## ASSIGNMENT 2 — MONGOOSE / MONGODB

| Req ID | Source | Requirement | Implementation | File(s) | Technology | How to Demonstrate | Deliverable |
|--------|--------|-------------|----------------|---------|------------|-------------------|-------------|
| A2-MG-01 | Assignments.docx | Mongoose + MongoDB | mongoose.connect() + models | `lib/mongoose/connection.ts`, `models/` | Mongoose | MongoDB Compass view | DB demo |
| A2-MG-02 | Assignments.docx | ApplicationEvent model | eventType, userId, action, metadata, timestamp | `models/ApplicationEvent.ts` | Mongoose | Query events collection | DB demo |
| A2-MG-03 | Assignments.docx | SecurityEvent model | eventType, userId, ip, device, timestamp | `models/SecurityEvent.ts` | Mongoose | Query security_events | DB demo |
| A2-MG-04 | Assignments.docx | ActivityEvent model | eventType, activityId, userId, metadata | `models/ActivityEvent.ts` | Mongoose | Query activity_events | DB demo |
| A2-MG-05 | Assignments.docx | Log events after mutations | createApplicationEvent() from actions | `lib/mongoose/events.ts` | Mongoose | Submit form; check MongoDB | DB demo |
| A2-MG-06 | Assignments.docx | PostgreSQL for relational; MongoDB for events | Clear separation | Architecture | Design | Show both DBs | DB demo |
| A2-MG-07 | Assignments.docx | docs/database-architecture.md | Two-database architecture explanation | `docs/database-architecture.md` | Markdown | Open file | docs/database-architecture.md |

## ASSIGNMENT 2 — TRANSACTIONAL EMAIL

| Req ID | Source | Requirement | Implementation | File(s) | Technology | How to Demonstrate | Deliverable |
|--------|--------|-------------|----------------|---------|------------|-------------------|-------------|
| A2-EM-01 | Both | Resend integration | Resend client | `lib/email/resend.ts` | Resend | Check Resend dashboard | Email demo |
| A2-EM-02 | Both | React Email templates | JSX-based email components | `emails/` | @react-email/components | Render template | Email preview |
| A2-EM-03 | Assignments.docx | ServiceRequestCreated template | Email on request creation | `emails/ServiceRequestCreated.tsx` | React Email | Create request; check inbox | Email |
| A2-EM-04 | Assignments.docx | ServiceRequestStatusUpdated template | Email on admin status update | `emails/ServiceRequestStatusUpdated.tsx` | React Email | Admin update; check inbox | Email |
| A2-EM-05 | Assignments.docx | CriticalActivityAlert template | Important notification email | `emails/CriticalActivityAlert.tsx` | React Email | Trigger alert | Email |
| A2-EM-06 | Assignments.docx | Email AFTER successful DB mutation | Prisma.create() → then email | `app/actions/service-requests.ts` | Sequential async | Show code order | Source |
| A2-EM-07 | Assignments.docx | Graceful email error handling | try/catch on email send | `lib/email/` | TypeScript | Trigger email error; mutation succeeds | Test |
| A2-EM-08 | Assignments.docx | RESEND_API_KEY in environment | .env.example placeholder | `.env.example` | dotenv | Show .env.example | File |
| A2-EM-09 | Assignments.docx | Resend webhook route | app/api/webhooks/resend/route.ts | `app/api/webhooks/resend/route.ts` | Next.js | POST webhook payload | Response |
| A2-EM-10 | Assignments.docx | Handle email.delivered | Update notification in DB | `app/api/webhooks/resend/route.ts` | Prisma | Simulate webhook; check DB | DB demo |
| A2-EM-11 | Assignments.docx | Handle email.bounced | Log bounce in DB | `app/api/webhooks/resend/route.ts` | Prisma | Simulate bounce | DB demo |
| A2-EM-12 | Assignments.docx | Webhook authenticity verification | Signature verification | `app/api/webhooks/resend/route.ts` | Crypto | Invalid sig → 400 | Response |
| A2-EM-13 | Assignments.docx | docs/email-system.md | Email system documentation | `docs/email-system.md` | Markdown | Open file | docs/email-system.md |

## UI REQUIREMENTS

| Req ID | Source | Requirement | Implementation | File(s) | Technology | How to Demonstrate | Deliverable |
|--------|--------|-------------|----------------|---------|------------|-------------------|-------------|
| UI-01 | Assignments.docx | Landing page | Hero, features, CTA | `app/(public)/page.tsx` | Next.js RSC | Navigate to / | UI |
| UI-02 | Assignments.docx | Activities page | Grid of activity cards | `app/activities/page.tsx` | Next.js RSC | Navigate to /activities | UI |
| UI-03 | Assignments.docx | Activity detail page | Full info + register + add to cart | `app/activities/[id]/page.tsx` | Next.js RSC | Click activity | UI |
| UI-04 | Assignments.docx | Student dashboard | Stats, requests, cart | `app/dashboard/page.tsx` | Next.js RSC | Navigate to /dashboard | UI |
| UI-05 | Assignments.docx | Create service request page | Form page | `app/requests/new/page.tsx` | RHF + Server Actions | Navigate to /requests/new | UI |
| UI-06 | Assignments.docx | My requests page | List of user's requests | `app/requests/page.tsx` | Next.js RSC | Navigate to /requests | UI |
| UI-07 | Assignments.docx | Admin dashboard | Stats | `app/admin/page.tsx` | Next.js RSC | Navigate to /admin | UI |
| UI-08 | Assignments.docx | Admin request management | All requests + status update | `app/admin/requests/page.tsx` | Next.js RSC + Actions | Navigate to /admin/requests | UI |
| UI-09 | Assignments.docx | Admin audit page | AuditLog table | `app/admin/audit/page.tsx` | Next.js RSC | Navigate to /admin/audit | UI |
| UI-10 | Assignments.docx | Auth pages | Sign in / Sign up | `app/auth/signin/page.tsx` | Better Auth | Sign in/out | Auth |
| UI-11 | Assignments.docx | Performance page | /performance | `app/(public)/performance/page.tsx` | Next.js RSC | Navigate | UI |
| UI-12 | Assignments.docx | All shadcn components | Card, Button, Input, Textarea, Select, Dialog, Dropdown, Toast, Table, Badge, Skeleton, Tabs, Sheet | `components/ui/` | shadcn/ui | Open pages | UI |

## LOADING / ERROR STATES

| Req ID | Source | Requirement | Implementation | File(s) | Technology | How to Demonstrate | Deliverable |
|--------|--------|-------------|----------------|---------|------------|-------------------|-------------|
| LS-01 | Assignments.docx | loading.tsx | Skeleton loading UI | `app/dashboard/loading.tsx` etc. | Next.js | Throttle; see skeleton | UI |
| LS-02 | Assignments.docx | error.tsx | Error boundary UI | `app/error.tsx` | Next.js | Trigger error | UI |
| LS-03 | Assignments.docx | not-found.tsx | 404 page | `app/not-found.tsx` | Next.js | Invalid URL | UI |
| LS-04 | Assignments.docx | Suspense for async | Wrapped server-fetched components | Multiple pages | React Suspense | Throttle; see loading | UI |

## SECURITY

| Req ID | Source | Requirement | Implementation | File(s) | Technology | How to Demonstrate | Deliverable |
|--------|--------|-------------|----------------|---------|------------|-------------------|-------------|
| SEC-01 | Assignments.docx | No secrets in client | All keys in .env; no NEXT_PUBLIC_ for secrets | `.env.example` | Next.js env | Inspect bundle | Bundle |
| SEC-02 | Assignments.docx | .env.example | Template with placeholders | `.env.example` | dotenv | Open file | File |
| SEC-03 | Assignments.docx | .gitignore | .env excluded | `.gitignore` | Git | git status | Git |
| SEC-04 | Assignments.docx | Validate all external input | Zod on all inputs | All actions + API routes | Zod | Send invalid data | Error |
| SEC-05 | Assignments.docx | Never accept role from client | Role from session only | `app/actions/`, `app/api/` | Better Auth | Try sending role in body | Ignored |
| SEC-06 | Assignments.docx | Prevent cross-user resource access | userId from session | `app/actions/`, `app/api/` | Better Auth | Code review | Source |

## DOCUMENTATION DELIVERABLES

| Doc ID | Source | Required File | Status |
|--------|--------|--------------|--------|
| DOC-01 | Assignments.docx | docs/rsc-hydration.md | TODO |
| DOC-02 | Assignments.docx | docs/state-management.md | TODO |
| DOC-03 | Assignments.docx | docs/server-actions.md | TODO |
| DOC-04 | Assignments.docx | docs/database.md | TODO |
| DOC-05 | Assignments.docx | docs/database-architecture.md | TODO |
| DOC-06 | Assignments.docx | docs/email-system.md | TODO |
| DOC-07 | Assignments.docx | docs/performance.md | TODO |
| DOC-08 | Assignments.docx | docs/architecture.md | TODO |
| DOC-09 | Assignments.docx | docs/assignment-1-report.md | TODO |
| DOC-10 | Assignments.docx | docs/assignment-2-architecture-note.md | TODO |
| DOC-11 | Assignments.docx | README.md | TODO |
| DOC-12 | Assignments.docx | .env.example | TODO |
| DOC-13 | Assignments.docx | .gitignore | TODO |

## TOTAL: ~165 REQUIREMENTS ACROSS BOTH DOCUMENTS

All requirements above will be implemented. Matrix complete — proceeding to Phase 2.
