# 🎮 CGU × BGMI — Official Tournament Platform

The official BGMI (Battlegrounds Mobile India) tournament registration and management platform for **C.V. Raman Global University** students.

**Live URL → [https://cgu-bgmi.netlify.app](https://cgu-bgmi.netlify.app)**

---

## 📋 Table of Contents

1. [What is this app?](#what-is-this-app)
2. [How the website works](#how-the-website-works)
3. [Tech stack](#tech-stack)
4. [Project structure](#project-structure)
5. [Setting up on your computer](#setting-up-on-your-computer)
6. [Running locally](#running-locally)
7. [Making changes](#making-changes)
8. [Adding tournaments](#adding-tournaments)
9. [Deploying to live site](#deploying-to-live-site)
10. [Environment variables](#environment-variables)
11. [Common issues and fixes](#common-issues-and-fixes)

---

## What is this app?

CGU × BGMI is a full-stack web app that lets CGU students:

- **Register** with their CGU college email (`@cgu-odisha.ac.in`)
- **Log in** securely with a password
- **View upcoming tournaments** added by admins from the database
- Choose between **Solo** or **Squad** match type during registration

Only students with a valid CGU email can register — anyone else gets blocked at the form level.

---

## How the website works

### Pages

| Page | URL | What it does |
|------|-----|--------------|
| Landing | `/` | Home page with hero section, features, and call to action |
| Register | `/register` | Sign up form for new players |
| Login | `/login` | Sign in for existing players |
| Dashboard | `/dashboard` | Shows upcoming tournaments (only accessible after login) |

### User flow

```
Landing Page
    ↓
Register (fill form with CGU email)
    ↓
Login (enter email + password)
    ↓
Dashboard (see all upcoming tournaments)
```

### Registration form fields

- **Full Name** — your real name
- **CGU Email** — must end with `@cgu-odisha.ac.in`, validated live as you type
- **Password** — minimum 6 characters
- **BGMI ID** — your numeric BGMI player ID
- **IGN (In-Game Name)** — your username inside BGMI
- **Mobile Number** — 10-digit Indian mobile number
- **Match Type** — toggle between Solo ⚔️ or Squad 🛡️

### After login

You land on the Dashboard which shows all tournaments fetched live from the database. Each tournament card shows:
- Tournament name and description
- Date and time
- Number of registered players vs max capacity
- Prize pool amount
- Status (Upcoming / Live / Completed)

---

## Tech stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 19 + Vite | Fast, modern UI framework |
| Styling | Tailwind CSS v3 | Utility-first CSS, easy to customize |
| Animations | Framer Motion | Smooth page and element animations |
| Icons | Lucide React | Clean icon library |
| Routing | React Router v7 | Client-side page navigation |
| Backend | Netlify Functions | Serverless API — no separate server needed |
| Database | Supabase (PostgreSQL) | Free hosted database with REST API |
| Auth | JWT (JSON Web Tokens) | Secure login tokens stored in browser |
| Password | bcryptjs | Passwords are hashed, never stored as plain text |
| Hosting | Netlify | Free hosting with automatic deploys |

---

## Project structure

```
CGUxBGMI/
│
├── src/                          ← All frontend React code
│   ├── pages/
│   │   ├── Landing.jsx           ← Home page
│   │   ├── Register.jsx          ← Registration form
│   │   ├── Login.jsx             ← Login form
│   │   └── Dashboard.jsx         ← Tournaments dashboard
│   │
│   ├── components/
│   │   ├── Navbar.jsx            ← Top navigation bar
│   │   └── ParticlesBG.jsx       ← Animated particle background
│   │
│   ├── App.jsx                   ← Routes setup
│   ├── main.jsx                  ← React entry point
│   └── index.css                 ← Global styles, animations, fonts
│
├── netlify/
│   └── functions/                ← Backend serverless API
│       ├── db.js                 ← Supabase client setup
│       ├── register.js           ← POST /register — creates new player
│       ├── login.js              ← POST /login — returns JWT token
│       └── tournaments.js        ← GET /tournaments — fetches all tournaments
│
├── public/                       ← Static files (favicon, icons)
├── index.html                    ← HTML entry point
├── tailwind.config.js            ← Tailwind theme (colors, fonts, animations)
├── netlify.toml                  ← Netlify build and deploy config
├── supabase_setup.sql            ← SQL to create database tables
├── setup_db.sql                  ← Original MySQL setup (local reference)
├── .env                          ← Local environment variables (never commit this)
└── package.json                  ← Project dependencies
```

---

## Setting up on your computer

### Prerequisites

Make sure you have these installed before starting:

1. **Node.js** (v18 or higher) — [nodejs.org](https://nodejs.org)
   - Check: open terminal and run `node --version`
2. **Git** — [git-scm.com](https://git-scm.com)
   - Check: `git --version`
3. **Netlify CLI** — install once globally:
   ```bash
   npm install -g netlify-cli
   ```

### Clone the project

```bash
git clone https://github.com/Prudhvi-69/CGUxBGMI.git
cd CGUxBGMI
```

### Install dependencies

```bash
npm install
```

This installs everything listed in `package.json` — React, Tailwind, Framer Motion, etc.

### Set up environment variables

Create a file called `.env` in the root folder:

```
SUPABASE_URL=https://mqdwzqehgdeirrvezpqp.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xZHd6cWVoZ2RlaXJydmV6cHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5Njc5MTMsImV4cCI6MjA5MDU0MzkxM30.QzwWGhz0tSyia29g0AfKc0uVV7oZU3yb6sXhlS_V6bQ
JWT_SECRET=cgu_bgmi_super_secret_key_2025
```

> ⚠️ The `.env` file is in `.gitignore` — it will never be pushed to GitHub. Keep it safe.

---

## Running locally

```bash
npm run dev
```

Opens the app at **http://localhost:5173**

The page auto-refreshes every time you save a file — no need to restart.

> **Note:** When running locally with `npm run dev`, the Netlify Functions (register, login, tournaments) won't work because they need the Netlify environment. To test the full app including backend locally, use:
> ```bash
> netlify dev
> ```
> This runs both the frontend and backend functions together at **http://localhost:8888**

---

## Making changes

### Changing text, colors or layout on any page

Open the file for that page and edit directly:

- **Landing page** → `src/pages/Landing.jsx`
- **Register page** → `src/pages/Register.jsx`
- **Login page** → `src/pages/Login.jsx`
- **Dashboard** → `src/pages/Dashboard.jsx`
- **Navbar** → `src/components/Navbar.jsx`

### Changing the color theme

Open `tailwind.config.js` and edit the colors under `bgmi`:

```js
colors: {
  bgmi: {
    gold: "#FFD700",      // ← change this for gold color
    orange: "#FF6B00",    // ← change this for orange/accent color
    dark: "#0A0A0F",      // ← main background color
    card: "#12121A",      // ← card/panel background
    border: "#2A2A3A",    // ← border color
  },
},
```

### Changing fonts

The app uses two Google Fonts:
- **Orbitron** — used for headings and labels (`font-display` class)
- **Rajdhani** — used for body text (`font-gaming` class)

To change them, edit the `@import` line at the top of `src/index.css` and update `tailwind.config.js` under `fontFamily`.

### Adding a new page

1. Create the file: `src/pages/NewPage.jsx`

```jsx
export default function NewPage() {
  return (
    <div className="relative min-h-screen z-10">
      <h1 className="text-white font-display text-4xl text-center pt-32">
        NEW PAGE
      </h1>
    </div>
  )
}
```

2. Add the route in `src/App.jsx`:

```jsx
import NewPage from './pages/NewPage'

// Inside <Routes>:
<Route path="/new-page" element={<NewPage />} />
```

3. Link to it from anywhere:

```jsx
import { Link } from 'react-router-dom'
<Link to="/new-page">Go to New Page</Link>
```

### Adding a new backend API function

Create a new file in `netlify/functions/`:

```js
// netlify/functions/myfunction.js
const { supabase } = require('./db')

exports.handler = async (event) => {
  // your logic here
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello!' })
  }
}
```

It becomes available at `/.netlify/functions/myfunction` automatically after deploy.

---

## Adding tournaments

You **never need to redeploy** to add tournaments. Just go to the Supabase dashboard and insert a row directly.

### Option 1 — Supabase Table Editor (easiest)

1. Go to → [supabase.com/dashboard/project/mqdwzqehgdeirrvezpqp/editor](https://supabase.com/dashboard/project/mqdwzqehgdeirrvezpqp/editor)
2. Click the **tournaments** table on the left
3. Click **Insert → Insert row**
4. Fill in the fields:

| Field | Example | Notes |
|-------|---------|-------|
| `name` | CGU BGMI Season 2 | Tournament title |
| `description` | Top 10 players win prizes | Short description |
| `date` | 2025-09-15 | Format: YYYY-MM-DD |
| `time` | 6:00 PM | Display time |
| `max_players` | 100 | Maximum registrations |
| `registered_count` | 0 | Start at 0 |
| `prize_pool` | 5000 | Amount in ₹ |
| `status` | upcoming | `upcoming`, `live`, or `completed` |

5. Click **Save** — it appears on the dashboard instantly for all users.

### Option 2 — SQL Editor

Go to → [supabase.com/dashboard/project/mqdwzqehgdeirrvezpqp/sql/new](https://supabase.com/dashboard/project/mqdwzqehgdeirrvezpqp/sql/new)

```sql
INSERT INTO tournaments (name, description, date, time, max_players, prize_pool, status)
VALUES ('CGU BGMI Season 2', 'Top players win prizes!', '2025-09-15', '6:00 PM', 100, '5000', 'upcoming');
```

### Updating a tournament status to LIVE

```sql
UPDATE tournaments SET status = 'live' WHERE name = 'CGU BGMI Season 2';
```

### Marking a tournament as completed

```sql
UPDATE tournaments SET status = 'completed' WHERE name = 'CGU BGMI Season 2';
```

---

## Deploying to live site

Every time you make changes and want them live on **https://cgu-bgmi.netlify.app**, run these 3 commands:

```bash
cd "c:\Users\Prudhvi\Desktop\My Projects\CGUxBGMI"
git add .
git commit -m "what did you change — write it here"
netlify deploy --prod
```

### What each command does

| Command | What it does |
|---------|-------------|
| `git add .` | Stages all your changed files |
| `git commit -m "message"` | Saves a snapshot of your changes with a description |
| `netlify deploy --prod` | Builds the app and pushes it live to Netlify |

### Good commit message examples

```bash
git commit -m "add new tournament card design"
git commit -m "fix login error message"
git commit -m "update landing page hero text"
git commit -m "add squad registration feature"
```

### Check deploy status

After deploying, Netlify prints the live URL and a build log link. You can also see all deploys at:
[app.netlify.com/projects/cgu-bgmi/deploys](https://app.netlify.com/projects/cgu-bgmi/deploys)

---

## Environment variables

These are secret config values the app needs to run. They are set in two places:

### For local development — `.env` file

```
SUPABASE_URL=https://mqdwzqehgdeirrvezpqp.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
JWT_SECRET=cgu_bgmi_super_secret_key_2025
```

### For production — Netlify dashboard

Go to → [app.netlify.com/projects/cgu-bgmi/configuration/env](https://app.netlify.com/projects/cgu-bgmi/configuration/env)

Or update via CLI:

```bash
netlify env:set VARIABLE_NAME value --context production
```

After changing env vars, always redeploy:

```bash
netlify deploy --prod
```

### What each variable does

| Variable | What it's for |
|----------|--------------|
| `SUPABASE_URL` | The URL of your Supabase project |
| `SUPABASE_ANON_KEY` | Public API key to access Supabase |
| `JWT_SECRET` | Secret key used to sign login tokens — keep this private |

---

## Common issues and fixes

### "Server error. Please try again." on register/login

**Cause:** Supabase tables don't exist or env vars are missing.

**Fix:** Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/mqdwzqehgdeirrvezpqp/sql/new) and run the contents of `supabase_setup.sql`.

---

### White background appears in input fields

**Cause:** Browser autofill injects its own white background.

**Fix:** Already handled in `src/index.css` with the `-webkit-autofill` override. If it reappears after a browser update, the fix is:

```css
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px #0d0d14 inset !important;
  -webkit-text-fill-color: #ffffff !important;
}
```

---

### Page shows blank / white screen after deploy

**Cause:** Usually a JavaScript error or a missing import.

**Fix:**
1. Open browser DevTools → Console tab — read the error
2. Run `npm run build` locally — it will show the exact error
3. Fix the error, then redeploy

---

### "netlify is not recognized" error

**Cause:** Netlify CLI is not installed or not in PATH.

**Fix:**
```bash
npm install -g netlify-cli
```

---

### Changes not showing on live site

**Cause:** You forgot to run `netlify deploy --prod` or the build failed.

**Fix:** Run the full deploy sequence:
```bash
git add .
git commit -m "update"
netlify deploy --prod
```

---

### Login works locally but not on live site

**Cause:** Env vars not set on Netlify production.

**Fix:**
```bash
netlify env:set SUPABASE_URL https://mqdwzqehgdeirrvezpqp.supabase.co --context production
netlify env:set SUPABASE_ANON_KEY your_key_here --context production
netlify env:set JWT_SECRET cgu_bgmi_super_secret_key_2025 --context production
netlify deploy --prod
```

---

## Useful links

| Resource | Link |
|----------|------|
| Live site | https://cgu-bgmi.netlify.app |
| GitHub repo | https://github.com/Prudhvi-69/CGUxBGMI |
| Netlify dashboard | https://app.netlify.com/projects/cgu-bgmi |
| Netlify deploy logs | https://app.netlify.com/projects/cgu-bgmi/deploys |
| Netlify function logs | https://app.netlify.com/projects/cgu-bgmi/logs/functions |
| Supabase dashboard | https://supabase.com/dashboard/project/mqdwzqehgdeirrvezpqp |
| Supabase table editor | https://supabase.com/dashboard/project/mqdwzqehgdeirrvezpqp/editor |
| Supabase SQL editor | https://supabase.com/dashboard/project/mqdwzqehgdeirrvezpqp/sql/new |

---

## Built by

**Prudhvi** — C.V. Raman Global University  
GitHub: [@Prudhvi-69](https://github.com/Prudhvi-69)

---

*CGU × BGMI — Register. Compete. Dominate.* 🎮
