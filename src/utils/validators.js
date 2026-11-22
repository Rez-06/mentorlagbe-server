import { SUBJECTS, CLASS_LEVELS, MODES } from "./constants.js";

export function validateTuition(body = {}) {
  const title = String(body.title ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const classLevel = String(body.classLevel ?? "").trim();
  const mode = String(body.mode ?? "").trim();
  let location = String(body.location ?? "").trim();
  const description = String(body.description ?? "").trim();
  const bannerImage = String(body.bannerImage ?? "").trim();
  const monthlyFee = Number(body.monthlyFee);
  const daysPerWeek = Number(body.daysPerWeek);

  if (title.length < 5 || title.length > 100) return { error: "Title must be 5 to 100 characters" };
  if (!SUBJECTS.includes(subject)) return { error: "Please choose a valid subject" };
  if (!CLASS_LEVELS.includes(classLevel)) return { error: "Please choose a valid class level" };
  if (!MODES.includes(mode)) return { error: "Mode must be Online or Offline" };
  if (mode === "Online" && !location) location = "Online";
  if (location.length < 2 || location.length > 100) return { error: "Location is required" };
  if (!Number.isFinite(monthlyFee) || monthlyFee < 100 || monthlyFee > 100000) return { error: "Monthly fee must be between 100 and 100000" };
  if (!Number.isInteger(daysPerWeek) || daysPerWeek < 1 || daysPerWeek > 7) return { error: "Days per week must be 1 to 7" };
  if (description.length < 20 || description.length > 2000) return { error: "Description must be 20 to 2000 characters" };
  if (bannerImage && !/^https?:\/\//i.test(bannerImage)) return { error: "Banner image must be a valid URL" };

  return { data: { title, subject, classLevel, mode, location, monthlyFee, daysPerWeek, description, bannerImage } };
}