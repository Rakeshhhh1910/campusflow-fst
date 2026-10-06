# CampusFlow — Submission Evidence Checklist

**Submission Date:** October 6, 2026  
**Course:** Fullstack Development with Next.js (DJS23AMD302)  
**Project:** CampusFlow (Unified Student Service & Activity Platform)  

This checklist details every screenshot, terminal log, and verification artifact required for your assignment viva and submission bundle.

---

## Part 1: Screenshots to Capture in Browser

Open `http://localhost:3000` in Google Chrome or your browser:

| # | Item | URL / Navigation | What to Show |
| :--- | :--- | :--- | :--- |
| **A** | **Application Home Page** | `http://localhost:3000/` | Full hero section, stats cards, and featured activities. |
| **B** | **Theme Switching** | Click the theme toggle icon in navbar | Show Light mode and Dark mode transitions without layout shift. |
| **C** | **Activities Page** | `http://localhost:3000/activities` | Filtered activity cards showing category badges and "Add to My Activities" buttons. |
| **D** | **Zustand Persistence** | `http://localhost:3000/activities` | 1. Add 2 activities to cart.<br>2. Open browser DevTools → Application → Local Storage (`campusflow-activity-cart`).<br>3. Refresh the page (Cmd+R); show activities remain in cart. |
| **E** | **Service Request Form** | `http://localhost:3000/requests/new` | Blank request form with category, priority, title, and description inputs. |
| **F** | **Client-Side Zod Validation Errors** | `http://localhost:3000/requests/new` | Type a 2-letter title and short description, click Submit → show inline red error messages. |
| **G** | **Successful Request Creation** | `http://localhost:3000/requests/new` | Fill valid request and submit → show green toast notification and redirect to `/requests`. |
| **H** | **Member Dashboard** | `http://localhost:3000/dashboard` | Log in as `member@campusflow.dev` → show student dashboard with statistics and personal request history. |
| **I** | **Admin Dashboard** | `http://localhost:3000/admin` | Log in as `admin@campusflow.dev` → show administrative analytics, total counts, and quick actions. |
| **J** | **Admin Request Status Update** | `http://localhost:3000/admin/requests` | Use the status dropdown on a request to change from `PENDING` to `APPROVED` → show toast notification. |
| **N** | **Better Auth Login** | `http://localhost:3000/auth/signin` | Sign-in page with email/password inputs and 1-Click quick demo buttons. |
| **O** | **Unauthorized Access Rejection** | Open incognito window and go to `http://localhost:3000/admin` | Shows automatic 307 redirect to `/auth/signin?callbackUrl=%2Fadmin&reason=unauthenticated`. |
| **S** | **Dynamic OG Image** | `http://localhost:3000/opengraph-image` | The dynamically generated social canvas with CampusFlow branding. |
| **T** | **Lighthouse Results** | `http://localhost:3000/` | Open DevTools → Lighthouse → Run Desktop Audit → Capture SEO 100, Best Practices 96, Accessibility 84, CLS 0. |

---

## Part 2: Terminal Logs & Verification Evidence

Run these commands in your terminal and save the terminal output or take a screenshot:

### **K. PostgreSQL/Prisma Persisted Records**
Run command:
```bash
npx tsx -e "import { prisma } from './lib/db/prisma'; prisma.serviceRequest.count().then(c => console.log('Total Requests in DB:', c));"
```
*Expected Output:* `Total Requests in DB: 42` (or current count).

---

### **L. Database Setup & Seed Command**
Run command:
```bash
npm run db:setup
```
*Expected Output:*
```
Datasource "db": PostgreSQL database "campusflow", schema "public" at "localhost:5432"
The database is already in sync with the Prisma schema.
🌱 Starting database seed...
👤 Creating demo users...
✅ Demo users created:
  - ADMIN:  admin@campusflow.dev  / Admin@1234
  - MEMBER: member@campusflow.dev / Member@1234
  - GUEST:  guest@campusflow.dev  / Guest@1234
🎭 Creating activities...
✅ Created 20 activities.
📋 Creating activity registrations...
✅ Created 58 activity registrations.
📝 Creating service requests...
✅ Created 42 service requests.
📊 Creating audit logs...
✅ Audit logs created.
🎉 Seed complete!
```

---

### **M. MongoDB/Mongoose Persisted Event**
Run command:
```bash
npx tsx -e "import { connectMongoDB } from './lib/mongoose/connection'; import { ApplicationEvent } from './models/ApplicationEvent'; connectMongoDB().then(() => ApplicationEvent.find().limit(2)).then(e => console.log(JSON.stringify(e, null, 2)));"
```
*Expected Output:* Real JSON array of Mongoose documents with `_id`, `eventType`, `resource`, `timestamp`.

---

### **P. React Email Template Rendering**
Run command:
```bash
npx tsx -e "import { render } from '@react-email/components'; import { ServiceRequestCreatedEmail } from './emails/ServiceRequestCreated'; render(ServiceRequestCreatedEmail({ userName: 'Priya', requestTitle: 'Lab WiFi', requestId: '123', category: 'IT_SUPPORT', priority: 'HIGH', status: 'PENDING' })).then(h => console.log('Rendered HTML size:', h.length, 'bytes'));"
```
*Expected Output:* `Rendered HTML size: 5980 bytes`.

---

### **R. Resend Webhook Verification**
Run command:
```bash
curl -X POST http://localhost:3000/api/webhooks/resend \
  -H "Content-Type: application/json" \
  -d '{"type":"email.delivered","data":{"email_id":"msg_123","to":["member@campusflow.dev"]}}'
```
*Expected Output:* `{"received":true}` (or signature verification response).

---

### **U. Successful Next.js Production Build**
Run command:
```bash
npm run build
```
*Expected Output:*
```
✓ Compiled successfully
✓ Finished TypeScript in 3.4s
✓ Generating static pages using 7 workers (19/19)
Route (app)
├ ○ /
├ ƒ /activities
├ ƒ /admin
├ ○ /auth/signin
├ ƒ /dashboard
├ ƒ /opengraph-image
├ ƒ /requests
```
