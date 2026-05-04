# ⚡ Job Finder — Frontend

A React 19 + TypeScript single-page application for the Job Finder platform. Features role-based dashboards for Job Seekers and Recruiters, JWT cookie auth, and a premium dark-mode UI.

---

## 📸 Screenshots

### Landing Page
![Landing Page](./doc/assets/FE_home_page.png)

### Login Page
![Login Page](./doc/assets/FE_login_page.png)

### Signup Page (tab-based role selector)
![Signup Page](./doc/assets/FE_signup_page.png)

### Job List (after login as Admin)
![Job List](./doc/assets/FE_job_page_login_admin.png)

### Job List (after login as Recruiter)
![Job List](./doc/assets/FE_recruiter_page.png)

### Job List Recruiter Profile
![Job List](./doc/assets/FE_recruiter_profile_page.png)

### Job List Job Seeker Profile
![Job List](./doc/assets/FE_seeker_profile_page.png)

### Job List Job Seeker Profile (scroll down)
![Job List](./doc/assets/FE_seeker_profile_page_continue.png)


---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI library |
| TypeScript | ~5.8 | Type safety |
| Vite | 6+ | Dev server & bundler |
| TailwindCSS | v4 | Utility CSS (via `@tailwindcss/vite`) |
| react-router-dom | v7 | Client-side routing |
| axios | latest | HTTP client with interceptors |

---

## 🏗 Project Structure

```
src/
├── api/
│   ├── axiosClient.ts      # Base axios instance + auth interceptors
│   ├── auth.api.ts         # signup, login, logout, getMe
│   └── jobs.api.ts         # getAllJobs, getJobById, CRUD for recruiter
├── context/
│   └── AuthContext.tsx     # User state, token lifecycle, hasRole()
├── types/
│   └── index.ts            # TypeScript interfaces (User, Job, Application …)
├── components/
│   ├── ui/                 # Button, Input, Textarea, Card, Badge, Modal
│   ├── layout/             # Navbar, ProtectedRoute
│   └── jobs/               # JobCard, JobList, JobForm
└── pages/
    ├── LandingPage.tsx           # Public — browse & filter jobs
    ├── LoginPage.tsx             # Public — sign in
    ├── SignupPage.tsx            # Public — register (seeker or recruiter)
    ├── JobDetailPage.tsx         # Public — full job detail + apply CTA
    ├── jobseeker/DashboardPage   # Protected (JOB_SEEKER) — browse jobs
    └── recruiter/DashboardPage   # Protected (RECRUITER) — CRUD job postings
```

---

## 🔐 Auth Flow

1. **Signup / Login** → backend returns `{ accessToken }` and sets a `refreshToken` HTTP-only cookie.
2. `accessToken` is stored in `localStorage` and attached to every request via an axios request interceptor (`Authorization: Bearer <token>`).
3. On page reload, the stored token is restored and `GET /api/auth/me` is called to hydrate the user session.
4. On any `401` response, the axios response interceptor fires an `auth:unauthorized` custom event; `AuthContext` listens and clears local state.
5. After a successful login, users are redirected to their role-specific dashboard:
   - `RECRUITER` → `/dashboard/recruiter`
   - `JOB_SEEKER` → `/dashboard/seeker`

---

## 🌐 API Integration

All calls go through `axiosClient` with `baseURL: '/api'` (Vite proxies `/api` → `http://localhost:5002`).

| Method | Endpoint | Role | Usage |
|--------|----------|------|-------|
| `POST` | `/auth/signup/jobseeker` | — | Job Seeker registration |
| `POST` | `/auth/signup/recruiter` | — | Recruiter registration |
| `POST` | `/auth/login` | — | Login |
| `POST` | `/auth/logout` | — | Logout |
| `GET`  | `/auth/me` | Bearer | Restore session |
| `GET`  | `/jobs/all` | — | Landing page & seeker dashboard |
| `GET`  | `/jobs/:id` | — | Job detail page |
| `GET`  | `/jobs/recruiter` | RECRUITER | Recruiter's own job listings |
| `POST` | `/jobs` | RECRUITER | Create job |
| `PUT`  | `/jobs/:id` | RECRUITER | Update job |
| `DELETE` | `/jobs/:id` | RECRUITER | Delete job |

---

## 🔑 Role-Based Routing

| Path | Component | Guard |
|------|-----------|-------|
| `/` | `LandingPage` | Public |
| `/login` | `LoginPage` | Public |
| `/signup` | `SignupPage` | Public |
| `/jobs/:id` | `JobDetailPage` | Public |
| `/dashboard/seeker` | `JobSeekerDashboard` | `JOB_SEEKER` required |
| `/dashboard/recruiter` | `RecruiterDashboard` | `RECRUITER` required |

`ProtectedRoute` redirects unauthenticated users to `/login` and users without the required role to `/`.

---

## ⚙️ Development

### Prerequisites
- Node.js 18+
- The backend must be running (see [`../job-finder-backend-customized`](../job-finder-backend-customized))

### Install & run

```bash
cd job-finder-react-customized
npm install
npm run dev
# Dev server: http://localhost:3000
# /api requests proxied to http://localhost:5002
```

### Build for production

```bash
npm run build   # outputs to dist/
npm run preview # preview the production build locally
```

---

## 🧩 Key Types (`src/types/index.ts`)

```ts
type Role = 'JOB_SEEKER' | 'RECRUITER' | 'ADMIN';
type ApplicationStatus = 'submitted' | 'shortlisted' | 'under_review' | 'rejected';

interface User {
  id: string; name: string; email: string;
  roles: Role[]; isActive: boolean;
  createdAt: string; updatedAt: string;
}

interface Job {
  id: string; recruiterId: string; title: string;
  description: string; requirements: string; location: string;
  salaryRange?: string; category?: string; isActive: boolean;
  createdAt: string; updatedAt: string;
  recruiter?: { companyName: string; industry?: string; companyWebsite?: string };
}
```

---

## 🔗 Backend

API source: [`../job-finder-backend-customized`](../job-finder-backend-customized) — Express/Prisma/PostgreSQL running on **port 5002**.
