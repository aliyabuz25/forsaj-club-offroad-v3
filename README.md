# Forsaj Club Offroad V3 🏎💨

Azerbaijan's premier offroad motorsport hub. This platform features a dynamic leaderboard, event galleries, video archives, and a multi-language localization system.

## 🚀 Features

- **Dynamic Leaderboard**: Automated driver ranking across 4 categories (Unlimited, Legend, Semi Stock, UTV).
- **Admin Dashboard**: Secure management of sitewide settings, marquee announcements, and driver points.
- **Localization**: Full support for **Azerbaijani (AZ)**, **English (EN)**, and **Russian (RU)**.
- **Media Archive**: High-density photo gallery with download capability and integrated YouTube video modals.
- **Premium Aesthetics**: High-performance dark mode UI with glassmorphism and smooth micro-animations.

## 🛠 Tech Stack

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS / Vanilla CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion / CSS Animate

## 🔐 Admin Panel

The admin dashboard is accessible via a hidden hash route.

- **URL**: `http://localhost:5173/#admin`
- **Authentication**: Managed via `json/users.json`.

### Default Credentials
| Username | Password | Role | Permissions |
| :--- | :--- | :--- | :--- |
| `admin` | `admin123` | Master | Full Access (Settings + Points) |
| `staff` | `staff123` | Secondary | Limited (Points only) |

## 📦 Setup & Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run local development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `/components`: UI units and page sections.
- `/context`: Global state for Admin settings and Language localization.
- `/json`: External data sources (Users, etc.).
- `/styles`: Global CSS and design tokens.

---
© 2024 Forsaj Club. All Rights Reserved.
