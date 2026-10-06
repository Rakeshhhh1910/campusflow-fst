# CampusFlow — System Architecture & Technical Specifications

**Course:** Fullstack Development with Next.js (DJS23AMD302)  
**Project:** CampusFlow — Student Service & Activity Management Platform  
**Architecture:** Dual-Database Enterprise Hybrid (PostgreSQL + MongoDB)  

---

## 1. Architectural Overview

CampusFlow is engineered as an enterprise-grade campus operations platform utilizing the Next.js App Router, combining Server Components (RSC) for zero-bundle-cost data rendering with Client Components for granular interactivity.

```
                     ┌──────────────────────────────────────────────┐
                     │          Browser / Client Layer              │
                     │  - shadcn/ui & Radix Accessible Primitives   │
                     │  - next-themes (Zero-Shift Theme Provider)   │
                     │  - Zustand (Persistent Activity Cart)        │
                     │  - React Hook Form + Client-side Zod         │
                     └──────────────────────┬───────────────────────┘
                                            │ HTTP / Server Action Calls
                                            ▼
                     ┌──────────────────────────────────────────────┐
                     │         Edge Proxy / Middleware              │
                     │  - Route Protection & Authentication Check    │
                     │  - Role Guard (/admin -> ADMIN, etc.)        │
                     └──────────────────────┬───────────────────────┘
                                            │
                                            ▼
                     ┌──────────────────────────────────────────────┐
                     │        Next.js App Router Server Layer       │
                     │  - React Server Components (RSC)             │
                     │  - Better Auth Session & Role Verification   │
                     │  - Type-Safe Server Actions & Route Handlers │
                     │  - Server-Side Zod Validation (safeParse)    │
                     └──────────────┬───────────────────────┬───────┘
                                    │                       │
             Prisma ORM (Relational)│                       │ Mongoose ODM (Telemetry)
                                    ▼                       ▼
      ┌──────────────────────────────────┐   ┌──────────────────────────────────┐
      │   PostgreSQL (Transactional Data)│   │   MongoDB (Event Stream / Audit) │
      │  - users & accounts (Better Auth)│   │  - ApplicationEvents             │
      │  - service_requests & activities │   │  - SecurityEvents                │
      │  - activity_registrations        │   │  - ActivityEvents                │
      │  - audit_logs & notifications    │   │  - Append-only high throughput   │
      └──────────────────────────────────┘   └──────────────────────────────────┘
```

---

## 2. Dual-Database Strategy: Why PostgreSQL + MongoDB?

Rather than duplicating data or forcing document structures into relational tables, CampusFlow separates concerns according to access patterns and data guarantees:

| Dimension | PostgreSQL (via Prisma ORM) | MongoDB (via Mongoose ODM) |
| :--- | :--- | :--- |
| **Data Type** | Structured, Relational Business Data | Flexible, Append-Only Event Streams |
| **Entities** | Users, ServiceRequests, Activities, Registrations, Accounts | ApplicationEvents, SecurityEvents, ActivityEvents |
| **ACID Guarantees** | Strong Consistency, Foreign Keys, Referential Integrity | Eventual Consistency, High Write Throughput |
| **Schema Model** | Strict schema migrations via `prisma/schema.prisma` | Flexible schemaless metadata payloads via Mongoose |
| **Use Case** | Financial, operational, and student service state | System audit trail, access telemetry, debugging logs |

### Connection Architecture
- **Prisma Singleton** (`lib/db/prisma.ts`): Caches the `PrismaClient` on `globalThis` to prevent connection exhaustion during hot-module reloads in development.
- **Mongoose Singleton** (`lib/mongoose/connection.ts`): Caches `mongooseConn` globally. In local development or demonstration mode, if a local daemon is unavailable, it automatically integrates with an embedded official MongoDB process (`mongodb-memory-server`) listening on `127.0.0.1:27017` to guarantee uninterrupted event persistence.

---

## 3. Defense-in-Depth Security & RBAC Model

CampusFlow enforces security across three distinct layers:

1. **Layer 1: Edge Proxy / Middleware (`middleware.ts`)**:
   - Inspects session cookies before request processing.
   - Redirects unauthenticated requests targeting `/admin/*`, `/dashboard`, or `/requests/new` to `/auth/signin` with `callbackUrl`.
   - Protects administrative routes by validating the role claim before page compilation.

2. **Layer 2: Server Action Authorization Guards (`lib/auth/session.ts`)**:
   - Never trusts the client or middleware alone.
   - Every Server Action independently validates session identity via `requireAuth()`.
   - Checks role authorization via `requireMember()` or `requireAdmin()`.
   - If an unauthorized user invokes the server action directly (e.g., via script), the action rejects with a `FORBIDDEN` error.

3. **Layer 3: Shared Schema Validation (`lib/validations/service-request.ts`)**:
   - Single Zod schema enforces length constraints, enum memberships, and field sanitization.
   - Client form catches errors in real time.
   - Server Action executes `serviceRequestSchema.safeParse(formData)` to prevent payload tampering.

---

## 4. State Management Separation: Server State vs. Client State

- **Server State (Prisma + RSC)**:
  - Activities list, user profile, service requests history, and admin tables are fetched directly within Server Components (`app/activities/page.tsx`, `app/requests/page.tsx`).
  - Zero client JavaScript bundle cost for database fetching.
  - Cached and revalidated on demand via `revalidatePath()`.

- **Client State (Zustand + `localStorage`)**:
  - Located in `store/activity-store.ts`.
  - Manages ephemeral interactive state: the student's selected activity cart drawer.
  - Uses `persist` middleware with `localStorage` so selected activities survive page refreshes.
  - Utilizes granular selector functions (`useActivityStore(state => state.isSelected(id))`) to prevent broad component re-renders.

---

## 5. Transactional Notification Flow

```
[Student Submits Form]
         │
         ▼
[createServiceRequest Server Action]
         │
         ├── 1. requireMember() (Session & Role Validation)
         ├── 2. serviceRequestSchema.safeParse() (Input Validation)
         ├── 3. prisma.serviceRequest.create() (PostgreSQL Transaction)
         ├── 4. prisma.auditLog.create() (Relational Audit Entry)
         ├── 5. logApplicationEvent() (MongoDB Document Event)
         ├── 6. sendEmail() via Resend SDK with React Email Component
         │      └── prisma.notificationEvent.create() (Tracking status: SENT)
         └── 7. revalidatePath('/requests')
```

If a Resend webhook event (`email.delivered`, `email.bounced`) is received at `/api/webhooks/resend`, the Route Handler verifies the Svix signature, updates `NotificationEvent.status` in PostgreSQL, and logs the event to MongoDB.
