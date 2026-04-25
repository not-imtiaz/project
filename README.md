<div align="center">

```
██╗███╗   ███╗████████╗██╗   ██╗██████╗ ███████╗██╗   ██╗
██║████╗ ████║╚══██╔══╝██║   ██║██╔══██╗██╔════╝██║   ██║
██║██╔████╔██║   ██║   ██║   ██║██║  ██║█████╗  ██║   ██║
██║██║╚██╔╝██║   ██║   ██║   ██║██║  ██║██╔══╝  ╚██╗ ██╔╝
██║██║ ╚═╝ ██║   ██║   ╚██████╔╝██████╔╝███████╗ ╚████╔╝ 
╚═╝╚═╝     ╚═╝   ╚═╝    ╚═════╝ ╚═════╝ ╚══════╝  ╚═══╝  
```

**A minimalist, iPhone-inspired project manager for hardware & software projects.**  
Track components, collaborators, code snippets, and project status — synced across all devices.

<br/>

[![Platform](https://img.shields.io/badge/Mobile-React%20Native%20%2F%20Expo-61dafb?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![Platform](https://img.shields.io/badge/Desktop-Electron%20%2F%20Web-47848f?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org)
[![Backend](https://img.shields.io/badge/Backend-Supabase-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-a855f7?style=for-the-badge)](LICENSE)

[![Node](https://img.shields.io/badge/Node.js-%E2%89%A5v18-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Build](https://img.shields.io/badge/Build-EAS-4630eb?style=flat-square&logo=expo&logoColor=white)](https://docs.expo.dev/build)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](https://github.com/not-imtiaz/project/pulls)

</div>

---

## ✨ Features

| | Feature | Description |
|---|---|---|
| 🗂️ | **Project Grid** | Browse all projects with category and status filters |
| 🔍 | **Instant Search** | Find projects by title or category in milliseconds |
| 🔩 | **Hardware Tracker** | Add/search from 100+ common parts (ESP32, sensors, modules) |
| 👥 | **Collaborators** | Add contributors with name & financial contribution tracking |
| 💻 | **Code Snippets** | Store code with a syntax-highlighted editor per project |
| 📝 | **Markdown Notes** | Write rich project notes with full Markdown support |
| ⚡ | **Full CRUD** | Create, read, update, and delete projects seamlessly |
| 🔄 | **Cross-Device Sync** | Phone and desktop share one Supabase database in real time |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| 📱 Frontend — Mobile | React Native (Expo) |
| 🖥️ Frontend — Desktop | HTML / CSS / JavaScript (Electron) |
| ☁️ Backend / Database | Supabase (PostgreSQL) |
| 📦 Build Tool | EAS — Expo Application Services |

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) **v18 or higher**
- [Expo CLI & EAS CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli eas-cli`
- [Supabase Account](https://supabase.com) — free tier works
- **Expo Go** app on your phone (for mobile testing)

---

## 🗄️ Supabase Setup

### 1. Create a project

Go to [supabase.com](https://supabase.com) → **New Project** → name it `ImtuDev` → pick the region closest to you → **Create project** (wait ~2 min).

### 2. Create the `projects` table

**SQL Editor → New Query**, paste and run:

```sql
-- Create the projects table
CREATE TABLE projects (
  id                    UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title                 TEXT        NOT NULL,
  category              TEXT,
  status                TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  project_note          TEXT,
  project_ingredients   JSONB,
  project_code          TEXT,
  project_collaborators JSONB
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow all operations (public access for development)
CREATE POLICY "Allow all operations" ON projects
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### 3. Get your API keys

**Settings → API** → copy your:
- **Project URL** — looks like `https://xxxxxxxxxxxx.supabase.co`
- **anon public key** — long string starting with `eyJ...`

> [!WARNING]
> Use the **anon/public** key — **NOT** the `service_role` secret key. The service role bypasses all RLS and should never touch your frontend.

---

## 📱 Mobile Setup — React Native / Expo

### 1. Clone and install

```bash
git clone https://github.com/not-imtiaz/project.git
cd project
npm install
```

### 2. Configure credentials

Create `app.config.js` in the project root:

```js
export default {
  expo: {
    name: 'ImtuDev',
    slug: 'project',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    splash: { backgroundColor: '#F9F9FB' },
    android: {
      package: 'com.imtudev.app',
      usesCleartextTraffic: true,
    },
    extra: {
      SUPABASE_URL: 'YOUR_SUPABASE_URL_HERE',
      SUPABASE_KEY: 'YOUR_ANON_KEY_HERE',
    },
  },
};
```

### 3. Start the dev server

```bash
npx expo start
```

Scan the QR code with **Expo Go** on your phone.

### 4. Build a standalone APK

```bash
eas login
eas build:configure          # Select "Android"
eas build -p android --profile preview
```

Download the APK from the EAS dashboard link and install it directly on your device.

---

## 🖥️ Desktop Setup — Electron / Browser

The desktop version lives in the `desktop/` folder.

### 1. Set up credentials

Create `desktop/.env`:

```
SUPABASE_URL=YOUR_SUPABASE_URL_HERE
SUPABASE_KEY=YOUR_ANON_KEY_HERE
```

### 2. Run the app

**Option A — Electron:**
```bash
cd desktop
electron .
```

**Option B — Browser:**
```bash
cd desktop
npx http-server -p 3000 --cors
# Open http://localhost:3000
```

> Both the mobile and desktop apps connect to the same Supabase database. Changes sync automatically between devices.

---

## 📁 Project Structure

```
project/
├── App.js                        # Mobile entry · navigation setup
├── app.config.js                 # Expo config & Supabase credentials
├── supabaseClient.js             # Supabase connection (mobile)
│
├── screens/
│   ├── HomeScreen.js             # Project grid + search + filters
│   ├── AddProjectScreen.js       # New project form
│   └── ProjectDetailScreen.js   # Edit / delete (detail view)
│
├── components/
│   ├── ProjectCard.js            # Card component for project grid
│   └── ConfirmModal.js           # Delete confirmation dialog
│
├── desktop/
│   ├── index.html                # Desktop dashboard structure
│   ├── style.css                 # Apple-inspired minimalist styling
│   └── renderer.js               # Desktop logic & Supabase operations
│
├── assets/                       # Icons, splash screen
├── .gitignore
└── README.md
```

---

## 🔒 Security Notes

| File | Contains | Commit to Git? |
|---|---|---|
| `app.config.js` | Supabase anon key | ✅ Yes — anon key is public-safe |
| `desktop/.env` | Supabase credentials | ❌ No — in `.gitignore` |
| `service_role` key | Admin DB access | ❌ Never put in frontend code |

The **anon key** is designed for client-side use — it's safe in your repo. The **service_role key** bypasses RLS entirely and should never be exposed.

---

## ❓ Troubleshooting

<details>
<summary><b>Network request failed</b></summary>

Check your Supabase URL and anon key. Free projects **pause after 7 days** of inactivity — go to [supabase.com/dashboard](https://supabase.com/dashboard), find your project, and click **Resume**.
</details>

<details>
<summary><b>Invalid API key</b></summary>

Make sure you're using the `anon` / public key (starts with `eyJ...`), **not** the `service_role` key.
</details>

<details>
<summary><b>column "id" does not exist</b></summary>

Re-run the SQL from the [Supabase Setup](#-supabase-setup) section above to create the table.
</details>

<details>
<summary><b>RLS policy error</b></summary>

Run the `CREATE POLICY` SQL command from the setup section.
</details>

<details>
<summary><b>White screen on phone</b></summary>

Check the terminal for errors. Clear the Expo cache:
```bash
npx expo start --clear
```
</details>

<details>
<summary><b>Desktop not connecting</b></summary>

Verify that `desktop/.env` exists and contains the correct values (no extra spaces or quotes).
</details>

---

## 🔗 Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase JS Client Docs](https://supabase.com/docs/reference/javascript)
- [Expo Documentation](https://docs.expo.dev)
- [EAS Build Docs](https://docs.expo.dev/build)

---

<div align="center">

MIT License · Built by **ImtuDev**

</div>
