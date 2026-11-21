import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { bearer } from "better-auth/plugins";
import { connectDB } from "./db.js";

const db = await connectDB();

const origins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((u) => u.trim())
  .filter(Boolean);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db),
  trustedOrigins: origins,

  user: {
    modelName: "users",
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "student", input: true },
      phone: { type: "string", required: false },
      bio: { type: "string", required: false },
      plan: { type: "string", required: false, defaultValue: "free", input: false },
    },
  },

  emailAndPassword: { enabled: true, minPasswordLength: 6, autoSignIn: true },

  
  plugins: [bearer()],

  databaseHooks: {
    user: {
      create: {
        // Nobody can register as admin or start on the pro plan
        before: async (user) => ({
          data: {
            ...user,
            role: ["student", "tutor"].includes(user.role) ? user.role : "student",
            plan: "free",
          },
        }),
      },
      update: {
        before: async (user) => {
          const { role, plan, ...rest } = user;
          return { data: rest };
        },
      },
    },
  },
});