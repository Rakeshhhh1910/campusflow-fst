/**
 * prisma/seed.ts
 *
 * Database seeding script using @faker-js/faker
 * Generates realistic, localized dummy data with proper foreign-key integrity.
 *
 * Run: npm run db:seed
 */

import { PrismaClient, UserRole, RequestStatus, RequestPriority, RequestCategory, ActivityCategory, AuditAction, NotificationStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { hashPassword } from "better-auth/crypto";

const prisma = new PrismaClient();

// ── Deterministic IDs for demo credentials ───────────────────────────────────
const DEMO_ADMIN_ID = "demo-admin-user-001";
const DEMO_MEMBER_ID = "demo-member-user-001";
const DEMO_GUEST_ID = "demo-guest-user-001";

async function main() {
  console.log("🌱 Starting database seed...\n");

  // ── 1. Clean existing data (order matters for FK constraints) ────────────────
  console.log("🗑️  Cleaning existing data...");
  await prisma.notificationEvent.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.activityRegistration.deleteMany();
  await prisma.serviceRequest.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Clean complete.\n");

  // ── 2. Create demo users with known credentials ──────────────────────────────
  console.log("👤 Creating demo users...");

  const adminUser = await prisma.user.create({
    data: {
      id: DEMO_ADMIN_ID,
      email: "admin@campusflow.dev",
      emailVerified: true,
      name: "Admin User",
      role: UserRole.ADMIN,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=admin`,
    },
  });

  const memberUser = await prisma.user.create({
    data: {
      id: DEMO_MEMBER_ID,
      email: "member@campusflow.dev",
      emailVerified: true,
      name: "Priya Sharma",
      role: UserRole.MEMBER,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=member`,
    },
  });

  const guestUser = await prisma.user.create({
    data: {
      id: DEMO_GUEST_ID,
      email: "guest@campusflow.dev",
      emailVerified: false,
      name: "Guest Visitor",
      role: UserRole.GUEST,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=guest`,
    },
  });

  const adminPasswordHash = await hashPassword("Admin@1234");
  const memberPasswordHash = await hashPassword("Member@1234");
  const guestPasswordHash = await hashPassword("Guest@1234");

  // Create Better Auth account entries for demo users (email/password provider)
  // Better Auth stores passwords in the accounts table
  await prisma.account.createMany({
    data: [
      {
        accountId: adminUser.id,
        providerId: "credential",
        userId: adminUser.id,
        password: adminPasswordHash,
      },
      {
        accountId: memberUser.id,
        providerId: "credential",
        userId: memberUser.id,
        password: memberPasswordHash,
      },
      {
        accountId: guestUser.id,
        providerId: "credential",
        userId: guestUser.id,
        password: guestPasswordHash,
      },
    ],
  });

  console.log(`✅ Demo users created:
  - ADMIN:  admin@campusflow.dev  / Admin@1234
  - MEMBER: member@campusflow.dev / Member@1234
  - GUEST:  guest@campusflow.dev  / Guest@1234\n`);

  // ── 3. Create additional random users ────────────────────────────────────────
  console.log("👥 Creating random users...");
  const randomUserCount = 15;
  const randomUsers = [];

  for (let i = 0; i < randomUserCount; i++) {
    const firstName = faker.person.firstName("female");
    const lastName = faker.person.lastName();
    const user = await prisma.user.create({
      data: {
        email: faker.internet
          .email({ firstName, lastName, provider: "djs.ac.in" })
          .toLowerCase(),
        emailVerified: faker.datatype.boolean(0.8),
        name: `${firstName} ${lastName}`,
        role: UserRole.MEMBER,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.alphanumeric(10)}`,
      },
    });
    randomUsers.push(user);
  }

  const allMembers = [memberUser, ...randomUsers];
  console.log(`✅ Created ${randomUserCount} random MEMBER users.\n`);

  // ── 4. Create activities ─────────────────────────────────────────────────────
  console.log("🎭 Creating activities...");

  const activityData = [
    { title: "Annual Tech Fest — TechNova 2026", category: ActivityCategory.TECHNICAL, capacity: 500 },
    { title: "Inter-College Cricket Tournament", category: ActivityCategory.SPORTS, capacity: 200 },
    { title: "Classical Dance Workshop", category: ActivityCategory.CULTURAL, capacity: 80 },
    { title: "Machine Learning Bootcamp", category: ActivityCategory.WORKSHOP, capacity: 60 },
    { title: "Literary Fest — Words & Worlds", category: ActivityCategory.CULTURAL, capacity: 300 },
    { title: "Basketball Championship", category: ActivityCategory.SPORTS, capacity: 150 },
    { title: "Open Source Hackathon", category: ActivityCategory.TECHNICAL, capacity: 120 },
    { title: "Yoga & Wellness Seminar", category: ActivityCategory.SOCIAL, capacity: 100 },
    { title: "Data Science Workshop", category: ActivityCategory.WORKSHOP, capacity: 50 },
    { title: "Cultural Night — Rang De Campus", category: ActivityCategory.CULTURAL, capacity: 800 },
    { title: "Badminton Open Tournament", category: ActivityCategory.SPORTS, capacity: 64 },
    { title: "Entrepreneurship Summit", category: ActivityCategory.SEMINAR, capacity: 250 },
    { title: "Photography Workshop", category: ActivityCategory.WORKSHOP, capacity: 40 },
    { title: "Alumni Guest Lecture Series", category: ActivityCategory.ACADEMIC, capacity: 200 },
    { title: "Environmental Awareness Drive", category: ActivityCategory.SOCIAL, capacity: 300 },
    { title: "Robotics Competition", category: ActivityCategory.TECHNICAL, capacity: 80 },
    { title: "Debate Championship", category: ActivityCategory.ACADEMIC, capacity: 100 },
    { title: "Art & Craft Exhibition", category: ActivityCategory.CULTURAL, capacity: 200 },
    { title: "Fitness Challenge — Fit Campus", category: ActivityCategory.SPORTS, capacity: 150 },
    { title: "Cloud Computing Seminar by Industry Expert", category: ActivityCategory.SEMINAR, capacity: 180 },
  ];

  const activities = [];
  for (const act of activityData) {
    const activity = await prisma.activity.create({
      data: {
        title: act.title,
        description: faker.lorem.paragraphs(2),
        category: act.category,
        date: faker.date.between({
          from: new Date("2026-11-01"),
          to: new Date("2027-03-31"),
        }),
        location: faker.helpers.arrayElement([
          "Main Auditorium",
          "Sports Complex",
          "Computer Lab 3",
          "Seminar Hall A",
          "Outdoor Ground",
          "Cultural Hall",
          "Library Meeting Room",
          "Room 205 — AI&ML Dept",
          "Campus Amphitheatre",
        ]),
        capacity: act.capacity,
        imageUrl: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/800/400`,
        isActive: true,
      },
    });
    activities.push(activity);
  }
  console.log(`✅ Created ${activities.length} activities.\n`);

  // ── 5. Create activity registrations ─────────────────────────────────────────
  console.log("📋 Creating activity registrations...");
  let registrationCount = 0;
  const registrationSet = new Set<string>();

  for (const user of allMembers) {
    // Each member registers for 2-5 random activities
    const numRegistrations = faker.number.int({ min: 2, max: 5 });
    const shuffled = faker.helpers.shuffle([...activities]);

    for (let i = 0; i < Math.min(numRegistrations, shuffled.length); i++) {
      const key = `${user.id}-${shuffled[i].id}`;
      if (!registrationSet.has(key)) {
        registrationSet.add(key);
        await prisma.activityRegistration.create({
          data: {
            userId: user.id,
            activityId: shuffled[i].id,
            registeredAt: faker.date.recent({ days: 30 }),
          },
        });
        registrationCount++;
      }
    }
  }
  console.log(`✅ Created ${registrationCount} activity registrations.\n`);

  // ── 6. Create service requests ───────────────────────────────────────────────
  console.log("📝 Creating service requests...");
  const serviceRequestTemplates = [
    { title: "Projector not working in Room 301", category: RequestCategory.IT_SUPPORT, priority: RequestPriority.HIGH },
    { title: "Library book renewal — overdue notice issue", category: RequestCategory.LIBRARY, priority: RequestPriority.LOW },
    { title: "Water cooler maintenance needed", category: RequestCategory.MAINTENANCE, priority: RequestPriority.MEDIUM },
    { title: "Wi-Fi connectivity issues in hostel block B", category: RequestCategory.IT_SUPPORT, priority: RequestPriority.HIGH },
    { title: "Sports equipment damaged", category: RequestCategory.SPORTS, priority: RequestPriority.MEDIUM },
    { title: "Canteen food quality complaint", category: RequestCategory.CANTEEN, priority: RequestPriority.MEDIUM },
    { title: "Classroom AC not functioning", category: RequestCategory.MAINTENANCE, priority: RequestPriority.URGENT },
    { title: "Online exam portal access issue", category: RequestCategory.ACADEMIC, priority: RequestPriority.URGENT },
    { title: "Scholarship form submission help needed", category: RequestCategory.ADMINISTRATIVE, priority: RequestPriority.HIGH },
    { title: "Lab computer virus/malware detected", category: RequestCategory.IT_SUPPORT, priority: RequestPriority.URGENT },
    { title: "Attendance correction request", category: RequestCategory.ACADEMIC, priority: RequestPriority.HIGH },
    { title: "Broken bench in cafeteria", category: RequestCategory.MAINTENANCE, priority: RequestPriority.LOW },
    { title: "Printer out of ink in library", category: RequestCategory.LIBRARY, priority: RequestPriority.MEDIUM },
    { title: "Basketball court light replacement", category: RequestCategory.SPORTS, priority: RequestPriority.MEDIUM },
    { title: "Campus ID card replacement request", category: RequestCategory.ADMINISTRATIVE, priority: RequestPriority.LOW },
  ];

  const statuses = [
    RequestStatus.PENDING,
    RequestStatus.IN_REVIEW,
    RequestStatus.APPROVED,
    RequestStatus.REJECTED,
    RequestStatus.RESOLVED,
  ];

  const serviceRequests = [];
  let srIndex = 0;

  for (const user of allMembers) {
    const numRequests = faker.number.int({ min: 1, max: 4 });
    for (let i = 0; i < numRequests; i++) {
      const template = serviceRequestTemplates[srIndex % serviceRequestTemplates.length];
      const status = faker.helpers.arrayElement(statuses);
      const createdAt = faker.date.between({
        from: new Date("2026-07-01"),
        to: new Date(),
      });

      const sr = await prisma.serviceRequest.create({
        data: {
          title: template.title,
          category: template.category,
          description: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 })),
          priority: template.priority,
          status,
          userId: user.id,
          adminNotes:
            status === RequestStatus.RESOLVED || status === RequestStatus.REJECTED
              ? faker.lorem.sentence()
              : null,
          resolvedAt:
            status === RequestStatus.RESOLVED
              ? faker.date.between({ from: createdAt, to: new Date() })
              : null,
          createdAt,
          updatedAt: faker.date.between({ from: createdAt, to: new Date() }),
        },
      });
      serviceRequests.push(sr);
      srIndex++;
    }
  }
  // Also create some for demo member
  for (let i = 0; i < 5; i++) {
    const template = serviceRequestTemplates[i];
    const status = i < 2 ? RequestStatus.PENDING : faker.helpers.arrayElement(statuses);
    await prisma.serviceRequest.create({
      data: {
        title: template.title,
        category: template.category,
        description: faker.lorem.paragraphs(2),
        priority: template.priority,
        status,
        userId: memberUser.id,
        adminNotes: null,
        resolvedAt: null,
      },
    });
  }

  console.log(`✅ Created ${serviceRequests.length + 5} service requests.\n`);

  // ── 7. Create audit logs ──────────────────────────────────────────────────────
  console.log("📊 Creating audit logs...");
  const auditActions = [
    AuditAction.REQUEST_CREATED,
    AuditAction.REQUEST_STATUS_CHANGED,
    AuditAction.REGISTRATION_CREATED,
    AuditAction.LOGIN,
    AuditAction.USER_CREATED,
  ];

  for (const sr of serviceRequests.slice(0, 20)) {
    await prisma.auditLog.create({
      data: {
        action: AuditAction.REQUEST_CREATED,
        userId: sr.userId,
        resource: "ServiceRequest",
        resourceId: sr.id,
        serviceRequestId: sr.id,
        metadata: {
          title: sr.title,
          category: sr.category,
          priority: sr.priority,
        },
        ipAddress: faker.internet.ip(),
        createdAt: sr.createdAt,
      },
    });

    if (sr.status !== RequestStatus.PENDING) {
      await prisma.auditLog.create({
        data: {
          action: AuditAction.REQUEST_STATUS_CHANGED,
          userId: adminUser.id,
          resource: "ServiceRequest",
          resourceId: sr.id,
          serviceRequestId: sr.id,
          metadata: {
            previousStatus: "PENDING",
            newStatus: sr.status,
            adminNotes: sr.adminNotes,
          },
          ipAddress: faker.internet.ip(),
          createdAt: sr.updatedAt,
        },
      });
    }
  }

  // Login audit logs for all users
  for (const user of [adminUser, memberUser, ...randomUsers.slice(0, 5)]) {
    await prisma.auditLog.create({
      data: {
        action: AuditAction.LOGIN,
        userId: user.id,
        resource: "Session",
        metadata: { email: user.email },
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent(),
        createdAt: faker.date.recent({ days: 7 }),
      },
    });
  }
  console.log("✅ Audit logs created.\n");

  // ── 8. Create notification events ────────────────────────────────────────────
  console.log("📧 Creating notification events...");
  for (const sr of serviceRequests.slice(0, 15)) {
    const status = faker.helpers.arrayElement([
      NotificationStatus.DELIVERED,
      NotificationStatus.SENT,
      NotificationStatus.BOUNCED,
    ]);
    await prisma.notificationEvent.create({
      data: {
        type: "SERVICE_REQUEST_CREATED",
        userId: sr.userId,
        status,
        emailAddress: faker.internet.email(),
        resendMessageId: `msg_${faker.string.alphanumeric(16)}`,
        serviceRequestId: sr.id,
        metadata: { subject: `Your request "${sr.title}" has been received` },
        sentAt: faker.date.recent({ days: 30 }),
        deliveredAt: status === NotificationStatus.DELIVERED ? faker.date.recent({ days: 29 }) : null,
        bouncedAt: status === NotificationStatus.BOUNCED ? faker.date.recent({ days: 28 }) : null,
      },
    });
  }
  console.log("✅ Notification events created.\n");

  // ── 9. Summary ───────────────────────────────────────────────────────────────
  const counts = {
    users: await prisma.user.count(),
    activities: await prisma.activity.count(),
    registrations: await prisma.activityRegistration.count(),
    serviceRequests: await prisma.serviceRequest.count(),
    auditLogs: await prisma.auditLog.count(),
    notifications: await prisma.notificationEvent.count(),
  };

  console.log("🎉 Seed complete!\n");
  console.log("📊 Database Summary:");
  console.table(counts);
  console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║               DEMO CREDENTIALS                        ║
  ╠═══════════════════════════════════════════════════════╣
  ║  ADMIN   admin@campusflow.dev   /  Admin@1234         ║
  ║  MEMBER  member@campusflow.dev  /  Member@1234        ║
  ║  GUEST   guest@campusflow.dev   /  Guest@1234         ║
  ╚═══════════════════════════════════════════════════════╝
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
