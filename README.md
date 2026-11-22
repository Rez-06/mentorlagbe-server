<div align="center">

# ⚙️ MentorLagbe API

### REST backend for the Smart Tuition & Mentorship Platform

[![Live API](https://img.shields.io/badge/Live%20API-Online-2ea44f?style=for-the-badge&logo=vercel&logoColor=white)](https://mentorlagbe-server-iodd.vercel.app/)
[![Live Site](https://img.shields.io/badge/Live%20Site-Visit-blue?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://mentorlagbe-client-pi.vercel.app/)
[![Client Repo](https://img.shields.io/badge/Client-Repo-181717?style=for-the-badge&logo=github)](https://github.com/Rez-06/mentorlagbe-client)

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![BetterAuth](https://img.shields.io/badge/BetterAuth-JWT-6C47FF)
![Stripe](https://img.shields.io/badge/Stripe-Webhooks-635BFF?logo=stripe&logoColor=white)

</div>

---

## 🔗 Quick Links

| | |
|---|---|
| ⚙️ **Live API** | https://mentorlagbe-server-iodd.vercel.app/ |
| 🌐 **Live Site** | https://mentorlagbe-client-pi.vercel.app/ |
| 💻 **Client Repo** | https://github.com/Rez-06/mentorlagbe-client |
| 🗄️ **Server Repo** | https://github.com/Rez-06/mentorlagbe-server |

---

## 📖 Purpose

This is the backend for **MentorLagbe**, a role-based tuition management platform connecting **Students**, **Tutors** and **Admins**. It handles authentication, role-based authorization, tuition moderation, applications, bookmarks, reviews, image uploads and Stripe subscription payments.

---

## 🔑 Admin Credentials

| Role | Email | Password |
|---|---|---|
| 🛡️ **Admin** | `admin@mentorlagbe.com` | `Admin@123` |
| 🧑‍🏫 **Tutor (Pro)** | `tutor@mentorlagbe.com` | `Tutor@123` |
| 🧑‍🏫 **Tutor (Free)** | `farhana@mentorlagbe.com` | `Tutor@123` |
| 🧑‍🎓 **Student** | `student@mentorlagbe.com` | `Student@123` |

> 💳 Stripe test card: `4242 4242 4242 4242`

---

## ✨ Key Features

- 🔐 **BetterAuth** with the MongoDB adapter (email/password) and role selection at sign-up (student or tutor); nobody can self-register as admin or start on Pro
- 🎟️ **JWT** issued from the BetterAuth session and verified on every protected route
- 🛡️ Custom middlewares: `verifyToken`, `verifyStudent`, `verifyTutor`, `verifyAdmin` (the user is reloaded from the DB on each request, so role and plan changes apply immediately)
- 🗃️ **4 collections:** `users`, `tuitions`, `applications`, `payments`
- 🔎 **Server-side** search, filter (class level, mode, subject), sorting and **pagination** using `.skip()` and `.limit()`
- 🧑‍🏫 Tutor CRUD with a **Free-plan limit of 2 posts** (unlimited on Pro)
- 🧑‍🎓 Student applications with **duplicate prevention**
- 🔖 Bookmarks (5 on Free, unlimited on Pro) and ⭐ reviews for accepted students
- 🛠️ Admin moderation, user role management, platform stats and transactions
- 💳 **Stripe Checkout** + signed **webhook** + success-page verification fallback (idempotent, with a unique index on session ID)
- 🖼️ **ImgBB** image upload endpoint (PNG, JPG, WEBP, GIF up to 4 MB)
- 🌱 AI-generated, connected **seed data** (users, 12+ approved tuitions, applications, payments, reviews)

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js, Express 5 |
| Database | MongoDB (Atlas) |
| Auth | BetterAuth, JSON Web Tokens |
| Payments | Stripe |
| Media | ImgBB API, Multer |
| Hosting | Vercel (serverless) |

### 📦 npm packages

`express` · `cors` · `dotenv` · `mongodb` · `better-auth` · `jsonwebtoken` · `multer` · `stripe` · `nodemon` (dev)

---

## 🗄️ Database Design

| Collection | Purpose |
|---|---|
| `users` | Accounts, role (`student` / `tutor` / `admin`), profile, plan (`free` / `pro`) |
| `tuitions` | Tuition posts with `approvalStatus` (`pending` / `approved` / `rejected`) and `isActive` |
| `applications` | Student applications with status (`pending` / `accepted` / `rejected`) |
| `payments` | Stripe Pro-plan transactions |

---

## 📡 API Overview

Base URL: `https://mentorlagbe-server-iodd.vercel.app`

| Area | Endpoints | Access |
|---|---|---|
| Health | `GET /api/health` | Public |
| Auth | `/api/auth/*` (BetterAuth), `POST /api/jwt` | Public / session |
| Users | `GET /api/users/me`, `PATCH /api/users/me` | Logged in |
| Tuitions | `GET /api/tuitions`, `GET /api/tuitions/latest`, `GET /api/tuitions/:id` | Public |
| Tutor | `GET/POST /api/tutor/tuitions`, `GET/PUT/DELETE /api/tutor/tuitions/:id`, `PATCH /api/tutor/tuitions/:id/toggle` | Tutor |
| Applications | `POST /api/applications`, `GET /api/applications/my`, `DELETE /api/applications/:id`, `GET /api/applications/tutor`, `PATCH /api/applications/:id/status` | Student / Tutor |
| Bookmarks | `GET /api/bookmarks`, `GET /api/bookmarks/ids`, `POST/DELETE /api/bookmarks/:tuitionId` | Logged in |
| Reviews | `GET /api/reviews`, `GET /api/reviews/eligibility/:tuitionId`, `POST /api/reviews` | Public / Student |
| Payments | `POST /api/payments/checkout`, `POST /api/payments/verify`, `POST /api/payments/webhook` | Logged in / Stripe |
| Upload | `POST /api/upload` | Logged in |
| Admin | `GET /api/admin/stats`, `/users`, `PATCH /users/:id/role`, `/tuitions`, `PATCH /tuitions/:id/status`, `GET /api/admin/payments` | Admin |

---

## 🚀 Run Locally

```bash
# 1. Clone
git clone https://github.com/Rez-06/mentorlagbe-server.git
cd mentorlagbe-server

# 2. Install
npm install

# 3. Environment variables
cp .env.example .env
# then fill in the values below

# 4. (Optional) seed demo data
npm run seed:all

# 5. Start
npm run dev
```

Server runs on http://localhost:5000

### 🔐 Environment Variables (`.env`)

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=mentorlagbe

CLIENT_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:5000
BETTER_AUTH_SECRET=long_random_string
JWT_SECRET=another_long_random_string
JWT_EXPIRES_IN=7d

IMGBB_API_KEY=your_imgbb_key

STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

> `CLIENT_URL` accepts a comma-separated list. No trailing slashes. For production use the deployed client and server URLs.

### 🌱 Seed scripts

```bash
npm run seed          # users, tuitions, applications, payments
npm run seed:reviews  # sample reviews
npm run seed:all      # both
```

> ⚠️ The seed resets the tuitions collection. Run it only on a database you are happy to overwrite.

### 💳 Stripe webhook (local testing)

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```
Copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET`.

---

## ☁️ Deployment (Vercel)

1. Import the repo into Vercel (framework preset: **Other**; `vercel.json` routes everything to `index.js`).
2. Add all environment variables listed above.
3. In MongoDB Atlas, allow network access from `0.0.0.0/0`.
4. Create a Stripe webhook endpoint at `https://mentorlagbe-server-iodd.vercel.app/api/payments/webhook` for the `checkout.session.completed` event, and put its signing secret in `STRIPE_WEBHOOK_SECRET`.
5. Redeploy after any environment change.

---

## 👨‍💻 Author

**Rez** · CSE Student, Islamic University of Technology (IUT)
GitHub: [@Rez-06](https://github.com/Rez-06)

<div align="center">

⭐ If you like this project, give it a star!

</div>
