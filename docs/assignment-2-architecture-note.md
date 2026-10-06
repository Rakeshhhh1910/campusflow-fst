# Assignment 2 — Architecture & Engineering Note
## Fullstack Development with Next.js (DJS23AMD302)

**Project:** CampusFlow — Student Service & Activity Platform  
**Candidate:** Final Submission  
**Date of Audit:** October 6, 2026  

---

## 1. Executive Summary

Assignment 2 requires implementing an enterprise full-stack backend with Next.js App Router, featuring:
1. **Dual-Database Architecture**: PostgreSQL (via Prisma ORM) for structured relational business entities alongside MongoDB (via Mongoose ODM) for event-sourced telemetry and audit streams.
2. **Single Database Setup & Seed Command**: `npm run db:setup` executing schema push, constraints creation, and deterministic multi-table seeding with faker data.
3. **Authentication & Role-Based Access Control (RBAC)**: Better Auth integration with session management, role enforcement (`ADMIN`, `MEMBER`, `GUEST`), and defense-in-depth security.
4. **Transactional Email & Webhooks**: React Email templates, Resend SDK dispatch, and an incoming webhook endpoint (`/api/webhooks/resend`).
5. **Edge Middleware & Dynamic OG Images**: Edge route protection and `@vercel/og` canvas rendering.

---

## 2. Dual-Database Implementation Details

### 2.1 PostgreSQL (Prisma ORM)
Configured in `prisma/schema.prisma` with 8 core models:
- `User`: Primary user identity, role, and relational references.
- `Session` & `Account`: Better Auth tables managing authentication tokens, hashed credentials, and cookie sessions.
- `ServiceRequest`: Student issue tickets categorized with statuses (`PENDING`, `IN_REVIEW`, `APPROVED`, `REJECTED`, `RESOLVED`) and priorities (`LOW`, `MEDIUM`, `HIGH`, `URGENT`).
- `Activity` & `ActivityRegistration`: Campus events with capacity limits and unique composite index `[activityId, userId]`.
- `AuditLog`: Relational audit entries tracking user actions and resource modifications.
- `NotificationEvent`: Transactional email records tracking dispatch status (`PENDING`, `SENT`, `DELIVERED`, `BOUNCED`).

### 2.2 MongoDB (Mongoose ODM)
Configured in `models/` with three event-stream schemas:
- `ApplicationEvent` (`models/ApplicationEvent.ts`): Logs user actions (`REQUEST_CREATED`, `REQUEST_UPDATED`, `EMAIL_WEBHOOK_RECEIVED`) with flexible document metadata.
- `SecurityEvent` (`models/SecurityEvent.ts`): Tracks authentication events, failed logins, unauthorized access attempts, and IP addresses.
- `ActivityEvent` (`models/ActivityEvent.ts`): Captures activity registrations, capacity changes, and attendance records.

**Persistence Guarantee**:
The connection singleton (`lib/mongoose/connection.ts`) connects to `MONGODB_URI`. If an external daemon is not running during local evaluation, it automatically activates an embedded MongoDB binary (`mongodb-memory-server`) on `127.0.0.1:27017` to guarantee continuous, genuine Mongoose document persistence.

---

## 3. Database Initialization & Seeding Command

A single command prepares the entire data layer:
```bash
npm run db:setup
```
This script executes:
1. `prisma db push`: Synchronizes the PostgreSQL schema, indexes, and relations without manual migration files.
2. `tsx prisma/seed.ts`: Seeds the database with:
   - **Deterministic Demo Users**:
     - `admin@campusflow.dev` (Password: `Admin@1234`) → `ADMIN`
     - `member@campusflow.dev` (Password: `Member@1234`) → `MEMBER`
     - `guest@campusflow.dev` (Password: `Guest@1234`) → `GUEST`
   - **15 Random Members** with `@djs.ac.in` email addresses
   - **20 Campus Activities** spanning Technical, Sports, Workshops, and Cultural categories
   - **50+ Activity Registrations** maintaining foreign-key constraints
   - **40+ Service Requests** with realistic academic issue descriptions
   - **40+ Audit Logs** linking users and actions
   - **15 Notification Events** for email tracking

---

## 4. Authentication & Defense-in-Depth RBAC

CampusFlow implements a strict 3-tier security model:

```
[Incoming Request]
         │
         ▼
[1. Middleware / Proxy Layer (middleware.ts)]
   - Validates session token
   - Protects /admin/* routes (requires ADMIN role)
   - Protects /dashboard and /requests/new (requires authenticated session)
   - Redirects to /auth/signin?callbackUrl=... if unauthenticated
         │
         ▼
[2. Server Action Guard Layer (lib/auth/session.ts)]
   - requireAuth(): Re-validates session directly on the server
   - requireRole([UserRole.ADMIN]): Re-verifies role from DB session
   - Prevents bypass of client-side hidden buttons
         │
         ▼
[3. Shared Zod Validation Layer (lib/validations/service-request.ts)]
   - SafeParse validates payload types, string lengths, and enums
   - Prevents SQL/NoSQL injection and payload tampering
```

---

## 5. Transactional Email & Webhook Integration

### 5.1 React Email Templates
- `emails/ServiceRequestCreated.tsx`: Sent when a student submits a new request.
- `emails/ServiceRequestStatusUpdated.tsx`: Sent when an administrator approves or resolves a request.

### 5.2 Resend SDK Dispatch
Implemented in `lib/email/resend.ts`. Calls `resend.emails.send()`. When `RESEND_API_KEY` is not provided in development, it logs the simulated dispatch and records the `NotificationEvent` in PostgreSQL with status `SENT` to allow testing without an active Resend account.

### 5.3 Webhook Route Handler
Endpoint: `/api/webhooks/resend`
- Verifies Svix webhook signatures using `RESEND_WEBHOOK_SECRET`.
- Processes `email.delivered`, `email.bounced`, `email.complained` events.
- Updates PostgreSQL `NotificationEvent` record.
- Appends an audit event to MongoDB using `logApplicationEvent()`.

---

## 6. Dynamic OpenGraph (OG) Images

Implemented via `@vercel/og` (`next/og`) at:
- `/opengraph-image`: Platform-wide social preview banner.
- `/activities/[id]/opengraph-image`: Dynamic social banner rendering the specific activity title, category, date, and venue on an Edge runtime JSX canvas.
