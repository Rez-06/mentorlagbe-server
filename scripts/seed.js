import "dotenv/config";
import { auth } from "../src/config/auth.js";
import { getDB } from "../src/config/db.js";
import { users, tuitions, applications, payments } from "../src/data/seedData.js";

const db = getDB();
const DAY = 24 * 60 * 60 * 1000;

console.log("🌱 Seeding MentorLagbe...");

// 1. Users (created through BetterAuth so passwords are hashed properly)
const byEmail = {};
for (const u of users) {
  const exists = await db.collection("users").findOne({ email: u.email });
  if (!exists) {
    await auth.api.signUpEmail({
      body: { name: u.name, email: u.email, password: u.password, role: u.role === "admin" ? "student" : u.role },
    });
  }
  await db.collection("users").updateOne(
    { email: u.email },
    { $set: { role: u.role, plan: u.plan || "free", phone: u.phone, bio: u.bio, image: "" } }
  );
  byEmail[u.email] = u;
}
console.log(`✅ ${users.length} users ready`);

// 2. Tuitions (reset)
await db.collection("tuitions").deleteMany({});
const tuitionDocs = tuitions.map((t, i) => ({
  title: t.title,
  subject: t.subject,
  classLevel: t.classLevel,
  mode: t.mode,
  location: t.location,
  monthlyFee: t.monthlyFee,
  daysPerWeek: t.daysPerWeek,
  bannerImage: "",
  description: t.description,
  tutorName: byEmail[t.tutor].name,
  tutorEmail: t.tutor,
  approvalStatus: t.status || "approved",
  isActive: t.isActive ?? true,
  createdAt: new Date(Date.now() - i * 1.5 * DAY),
}));
const { insertedIds } = await db.collection("tuitions").insertMany(tuitionDocs);
console.log(`✅ ${tuitionDocs.length} tuitions inserted`);

// 3. Applications (reset)
await db.collection("applications").deleteMany({});
const applicationDocs = applications.map((a, i) => {
  const t = tuitionDocs[a.tuition];
  return {
    tuitionId: insertedIds[a.tuition],
    tuitionTitle: t.title,
    subject: t.subject,
    monthlyFee: t.monthlyFee,
    tutorEmail: t.tutorEmail,
    studentName: byEmail[a.student].name,
    studentEmail: a.student,
    studentPhone: a.phone,
    preferredSchedule: a.schedule,
    studentNote: a.note,
    status: a.status,
    appliedAt: new Date(Date.now() - (i + 1) * DAY),
  };
});
await db.collection("applications").insertMany(applicationDocs);
console.log(`✅ ${applicationDocs.length} applications inserted`);

// 4. Payments (reset)
await db.collection("payments").deleteMany({});
await db.collection("payments").insertMany(
  payments.map((p, i) => ({
    userEmail: p.email,
    userName: byEmail[p.email].name,
    userRole: byEmail[p.email].role,
    planName: p.planName,
    amount: p.amount,
    currency: "usd",
    transactionId: p.transactionId,
    stripeSessionId: p.stripeSessionId,
    paymentStatus: "paid",
    paidAt: new Date(Date.now() - (i + 3) * DAY),
  }))
);
console.log(`✅ ${payments.length} payments inserted`);

console.log("\n🎉 Done. Demo logins:");
console.log("   Admin   admin@mentorlagbe.com    / Admin@123");
console.log("   Tutor   tutor@mentorlagbe.com    / Tutor@123");
console.log("   Student student@mentorlagbe.com  / Student@123");
process.exit(0);