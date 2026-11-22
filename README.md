# MentorLagbe: Smart Tuition & Mentorship Platform (Server)

REST API for MentorLagbe, built with Express 5, MongoDB, BetterAuth, JWT and Stripe.

**API (live):** https://YOUR-SERVER.vercel.app
**Client repo:** https://github.com/YOURNAME/mentorlagbe-client
**Live site:** https://YOUR-CLIENT.vercel.app

## Admin credentials
Email: `admin@mentorlagbe.com`  |  Password: `Admin@123`

## Key features
- BetterAuth with MongoDB adapter (email/password) and role selection at sign-up (student/tutor)
- JWT issued from the session; custom middlewares `verifyToken`, `verifyStudent`, `verifyTutor`, `verifyAdmin`
- 4 collections: `users`, `tuitions`, `applications`, `payments`
- Server-side search, filter, sort and pagination for tuitions
- Tutor CRUD with free-plan limit; student applications with duplicate prevention
- Admin moderation, user roles, platform stats and transactions
- Stripe Checkout, success verification and webhook (idempotent)
- ImgBB image upload endpoint
- Saved tuitions and reviews
- AI-style seed script with connected demo data

## npm packages
`express`, `cors`, `dotenv`, `mongodb`, `better-auth`, `jsonwebtoken`, `multer`, `stripe`, `nodemon`

## Environment variables (.env)
See `.env.example`: `PORT`, `MONGODB_URI`, `DB_NAME`, `CLIENT_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `IMGBB_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

## Run locally
1. `npm install`
2. Create `.env` from `.env.example`
3. `npm run seed:all` (demo data)
4. `npm run dev`