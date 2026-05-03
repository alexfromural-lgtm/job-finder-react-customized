---
title: walkthrough
type: note
permalink: main/projects/job-finder-backend-customized/walkthrough
---

# Job Finder Frontend — Walkthrough

A fully functional React 19 + TypeScript + TailwindCSS v4 frontend connected to the existing Express/Prisma backend at `localhost:5002`.

---

## Screenshots

### Landing Page
![Landing Page](./doc/assets/FE_home_page.png)

### Login Page
![Login Page](./doc/assets/FE_login_page.png)

### Signup Page (Tab-based role selector)
![Signup Page](.doc/assets/FE_signup_page.png)

---

## Tech Stack

| Tech | Version |
|------|---------|
| React | 19.1.1 |
| TypeScript | ~5.8.3 |
| TailwindCSS | v4.1.12 |
| Vite | v7.1.4 |
| react-router-dom | latest |
| axios | latest |

---

## Architecture

```
src/
├── api/          # axios calls (auth, jobs)
├── context/      # AuthContext with token lifecycle
├── types/        # TypeScript interfaces matching Prisma schema
├── components/
│   ├── ui/       # Button, Input, Card, Badge, Modal
│   ├── layout/   # Navbar, ProtectedRoute
│   └── jobs/     # JobCard, JobList, JobForm
└── pages/
    ├── LandingPage   (public, job browsing + search)
    ├── LoginPage     (public)
    ├── SignupPage    (public, role selector)
    ├── JobDetailPage (public)
    ├── jobseeker/DashboardPage  (protected: JOB_SEEKER)
    └── recruiter/DashboardPage  (protected: RECRUITER — CRUD modals)
```

---

## Auth Flow

1. **Signup/Login** → backend returns `{ accessToken }` + sets `refreshToken` HTTP-only cookie
2. `accessToken` stored in `localStorage`, attached via axios interceptor as `Authorization: Bearer`
3. On page reload, token is restored and `/api/auth/me` is called to restore user session
4. On 401, axios fires `auth:unauthorized` event, context clears state

---

## API Integration

- `GET /api/jobs/all` — public job listings
- `GET /api/jobs/:id` — job detail
- `POST /api/auth/signup/jobseeker` — job seeker registration
- `POST /api/auth/signup/recruiter` — recruiter registration (includes company fields)
- `POST /api/auth/login` — login
- `POST /api/auth/logout` — logout + clear cookie
- `GET /api/auth/me` — session restore
- `GET /api/jobs/recruiter` — recruiter's own jobs
- `POST /api/jobs` — create job
- `PUT /api/jobs/:id` — update job
- `DELETE /api/jobs/:id` — delete job

---

## Development

```bash
# Frontend dev server (port 3000, proxies /api to :5002)
cd C:\TestPrj\job-finder-react-customized
npm run dev
```

```bash
# Backend must also be running
cd C:\TestPrj\job-finder-backend-customized
npm run dev  # runs on port 5002
```

---

## Build Status

```
✓ tsc -b — 0 errors
✓ vite build — 112 modules, 2.09s
  dist/assets/index.css   13.13 kB (gzip: 3.79 kB)
  dist/assets/index.js   300.02 kB (gzip: 96.93 kB)
```


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
