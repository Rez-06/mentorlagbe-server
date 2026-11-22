import "dotenv/config";
import { connectDB } from "../src/config/db.js";

const db = await connectDB();
const comments = [
  "Clear explanations and very patient. My grades improved in just two months.",
  "Well organised classes and regular feedback. Highly recommended!",
  "Friendly tutor who makes hard topics simple to understand.",
];
const ratings = [5, 5, 4];

const accepted = await db.collection("applications").find({ status: "accepted" }).toArray();
let i = 0;
for (const a of accepted) {
  const student = await db.collection("users").findOne({ email: a.studentEmail });
  const tuition = await db.collection("tuitions").findOne({ _id: a.tuitionId });
  if (!student || !tuition) continue;

  const review = {
    studentId: String(student._id),
    studentName: student.name,
    studentImage: student.image || "",
    rating: ratings[i % 3],
    comment: comments[i % 3],
    createdAt: new Date(Date.now() - i * 86400000),
  };
  const all = [review, ...(tuition.reviews || []).filter((r) => r.studentId !== review.studentId)];
  const avgRating = Math.round((all.reduce((s, r) => s + r.rating, 0) / all.length) * 10) / 10;

  await db.collection("tuitions").updateOne({ _id: tuition._id }, { $set: { reviews: all, avgRating, reviewCount: all.length } });
  console.log(`⭐ Review added to "${tuition.title}" by ${student.name}`);
  i++;
}
console.log("✅ Review seeding done");
process.exit(0);