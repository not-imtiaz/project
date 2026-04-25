# Project by ImtuDev

A minimalist, iPhone-inspired project manager for hardware/software projects. Track components, collaborators with financial contributions, code snippets, and project status — all synced across devices via Supabase.

🖥️ **Desktop (Electron/Web)** · 📱 **Mobile (React Native / Expo)**

---

## ✨ Features

- **Project Grid** — Browse all projects with category and status filters
- **Search** — Find projects by title or category instantly
- **Hardware Ingredient Tracker** — Add/search from 100+ common parts (ESP32, sensors, etc.)
- **Collaborator Management** — Add contributors with name & financial contribution
- **Code Snippets** — Store code with syntax-highlighted editor
- **Markdown Notes** — Write project notes with Markdown support
- **CRUD Operations** — Create, Read, Update, Delete projects
- **Cross-Device Sync** — Phone and desktop share the same Supabase database

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend (Mobile) | React Native (Expo) |
| Frontend (Desktop) | HTML / CSS / JavaScript (Electron) |
| Backend | Supabase (PostgreSQL) |
| Build Tool | EAS (Expo Application Services) |

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli eas-cli`)
- [Supabase Account](https://supabase.com) (free tier works)
- Expo Go app on your phone (for mobile testing)

---

## 🗄️ Supabase Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in:
   - Name: `ImtuDev`
   - Database Password: (create a strong one, save it somewhere safe)
   - Region: Choose closest to your location
4. Click **"Create project"** and wait 1-2 minutes

### 2. Create the projects table

In your Supabase dashboard, go to **SQL Editor** → **New Query** and run:

```sql
-- Create the projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  project_note TEXT,
  project_ingredients JSONB,
  project_code TEXT,
  project_collaborators JSONB
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow all operations (public access for development)
CREATE POLICY "Allow all operations" ON projects
  FOR ALL
  USING (true)
  WITH CHECK (true);
3. Get your API keys
In your Supabase dashboard, go to Settings → API

Under Project API Keys, copy:

Project URL (looks like https://xxxxxxxxxxxx.supabase.co)

anon public key (long string starting with eyJ...)

⚠️ Use the anon/public key, NOT the service_role secret key.

📱 Mobile Setup (React Native / Expo)
1. Clone and install
bash
git clone https://github.com/not-imtiaz/project.git
cd project
npm install
2. Configure credentials
Create app.config.js in the project root:

javascript
export default {
  expo: {
    name: 'ImtuDev',
    slug: 'project',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    splash: {
      backgroundColor: '#F9F9FB',
    },
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
Replace YOUR_SUPABASE_URL_HERE and YOUR_ANON_KEY_HERE with your actual values from step 3 above.

3. Start the app
bash
npx expo start
Scan the QR code with Expo Go on your phone.

4. Build a standalone APK
bash
eas login
eas build:configure          # Select "Android"
eas build -p android --profile preview
Download the APK from the link and install it directly on your device.

🖥️ Desktop Setup (Electron / Browser)
The desktop version lives in the desktop/ folder.

Files
desktop/index.html — Main dashboard structure

desktop/style.css — Apple-inspired minimalist styling

desktop/renderer.js — All Supabase logic, CRUD operations, filtering

1. Set up environment variables
Create a .env file inside the desktop/ folder:

text
SUPABASE_URL=YOUR_SUPABASE_URL_HERE
SUPABASE_KEY=YOUR_ANON_KEY_HERE
2. Run the app
You have two options:

Option A: Electron

bash
cd desktop
electron .
Option B: Browser (with CORS disabled)

bash
cd desktop
npx http-server -p 3000 --cors
Then open http://localhost:3000 in your browser.

The desktop and mobile apps share the same Supabase database, so your projects sync automatically between devices.

📁 Project Structure
text
project/
├── App.js                      # Mobile app entry with navigation
├── app.config.js               # Expo configuration & Supabase credentials
├── supabaseClient.js           # Supabase connection for mobile
├── screens/
│   ├── HomeScreen.js           # Project grid with search & filters
│   ├── AddProjectScreen.js     # New project form
│   └── ProjectDetailScreen.js  # Edit/delete project (detail view)
├── components/
│   ├── ProjectCard.js          # Card component for project grid
│   └── ConfirmModal.js         # Delete confirmation dialog
├── desktop/
│   ├── index.html              # Desktop dashboard structure
│   ├── style.css               # Desktop styling
│   └── renderer.js             # Desktop logic & Supabase operations
├── assets/                     # Icons, splash screen, etc.
├── .gitignore                  # Files excluded from Git
└── README.md                   # This file
🔒 Security Notes
File	Contains	Commit to Git?
app.config.js	Supabase anon key	✅ Yes (anon key is public-safe)
desktop/.env	Supabase credentials	❌ No (in .gitignore)
Supabase service_role key	Admin access	❌ Never put in frontend code
The anon key is designed to be used in client-side code — it's safe in your repo.

The service_role key bypasses RLS and should never be exposed.

For production, move credentials to EAS Secrets or environment variables.

❓ Troubleshooting
Issue	Solution
Network request failed	Check your Supabase URL and anon key. Ensure your Supabase project isn't paused (free projects pause after 7 days of inactivity).
Invalid API key	Make sure you're using the anon/public key (starts with eyJ...), NOT the service_role key.
column "id" does not exist	Run the SQL commands in the "Supabase Setup" section above.
RLS policy error	Run the CREATE POLICY SQL command from the setup section.
White screen on phone	Check the terminal for errors. Run npx expo start --clear to clear the cache.
Desktop not connecting	Verify the .env file exists in desktop/ with correct values.
Supabase project paused	Go to supabase.com/dashboard, click your project, click "Resume".
🔄 Syncing Between Devices
Both the mobile app and desktop app connect to the same Supabase database. Changes made on one device will appear on the other when you refresh or navigate back to the home screen.

📄 License
MIT — built by ImtuDev

🔗 Links
Supabase Dashboard: supabase.com/dashboard

Supabase JS Client Docs: supabase.com/docs/reference/javascript

Expo Docs: docs.expo.dev

EAS Build Docs: docs.expo.dev/build

text

---

## Save and push

```bash
# Save in nano: Ctrl+O, Enter, Ctrl+X

git add README.md
git commit -m "Add comprehensive README with desktop instructions"
git push
Done! Your GitHub repo now has a professional README covering both mobile and desktop setups.

This response is AI-generated, for reference only.
