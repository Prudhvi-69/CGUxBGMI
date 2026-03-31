# CGU × BGMI — Official Tournament Platform

The official BGMI tournament registration and management platform for **C.V. Raman Global University** students.

## Features
- 🎮 Gaming-themed UI with glitch effects, neon borders, particle background
- 📝 Registration with CGU email validation (`@cgu-odisha.ac.in` only)
- 🔐 JWT-based authentication
- 🏆 Live tournament dashboard fetched from MySQL
- ⚔️ Solo / Squad match type toggle
- 🚀 Netlify-ready (frontend + serverless functions)

---

## Local Development

### 1. Setup MySQL Database
```bash
mysql -u root -pStudents@69 < setup_db.sql
```

### 2. Install dependencies
```bash
npm install
```

### 3. Install Netlify CLI
```bash
npm install -g netlify-cli
```

### 4. Run locally with Netlify Dev (functions + frontend together)
```bash
netlify dev
```
> This runs both the Vite dev server and the Netlify Functions locally.

---

## Netlify Deployment

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Connect to Netlify
- Go to [netlify.com](https://netlify.com) → New site from Git
- Select your repo
- Build command: `npm run build`
- Publish directory: `dist`

### 3. Set Environment Variables in Netlify Dashboard
Go to **Site Settings → Environment Variables** and add:

| Key | Value |
|-----|-------|
| `DB_HOST` | Your MySQL host (use a cloud MySQL like PlanetScale or Railway for production) |
| `DB_USER` | `root` |
| `DB_PASS` | `Students@69` |
| `DB_NAME` | `cgubgmi` |
| `JWT_SECRET` | `cgu_bgmi_super_secret_key_2025` |

> ⚠️ **Important**: Netlify Functions are serverless and cannot connect to `localhost` MySQL in production. Use a cloud MySQL provider like:
> - [PlanetScale](https://planetscale.com) (free tier)
> - [Railway](https://railway.app) (free tier)
> - [Aiven](https://aiven.io) (free tier)

---

## Adding Tournaments
Connect to your MySQL and insert tournaments directly:
```sql
USE cgubgmi;
INSERT INTO tournaments (name, description, date, time, max_players, prize_pool, status)
VALUES ('Tournament Name', 'Description here', '2025-09-15', '6:00 PM', 100, '5000', 'upcoming');
```

---

## Project Structure
```
CGUxBGMI/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx      # Home page
│   │   ├── Register.jsx     # Registration form
│   │   ├── Login.jsx        # Login page
│   │   └── Dashboard.jsx    # Tournaments dashboard
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ParticlesBG.jsx
│   ├── App.jsx
│   └── index.css
├── netlify/
│   └── functions/
│       ├── db.js            # MySQL connection
│       ├── register.js      # POST /register
│       ├── login.js         # POST /login
│       └── tournaments.js   # GET /tournaments
├── setup_db.sql             # Database setup script
├── netlify.toml             # Netlify config
└── .env                     # Local env vars
```
