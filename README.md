# Forsaj Club Offroad V3 🏎💨

Azerbaijan's premier offroad motorsport hub. This platform features a dynamic leaderboard, event galleries, video archives, and a multi-language localization system.

## 🚀 Features

- **Dynamic Leaderboard**: Automated driver ranking across 4 categories (Unlimited, Legend, Semi Stock, UTV).
- **Admin Dashboard**: Secure management of sitewide settings, marquee announcements, and driver points.
- **User Management**: Create and manage admin accounts (Master & Secondary roles).
- **Localization**: Full support for **Azerbaijani (AZ)**, **English (EN)**, and **Russian (RU)**.
- **Media Archive**: High-density photo gallery with download capability and integrated YouTube video modals.
- **Premium Aesthetics**: High-performance dark mode UI with glassmorphism and smooth micro-animations.

## 🛠 Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js (Express)
- **Database**: JSON-based Flat File Persistence
- **Deployment**: Docker & Docker Compose
- **Proxy**: Traefik (HTTPS Ready)

## 🔐 Admin Panel

The admin dashboard is accessible via a hidden hash route.
- **URL**: `https://forsaj.octotech.az/#admin`

### Default Credentials
| Username | Password | Role | Permissions |
| :--- | :--- | :--- | :--- |
| `admin` | `admin123` | Master | Full Access (Settings + Users) |

## 📦 Deployment (Docker)

To deploy the application using Docker and Traefik:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aliyabuz25/forsaj-club-offroad-v3.git
   cd forsaj-club-offroad-v3
   ```

2. **Deploy with Docker Compose**:
   ```bash
   docker-compose up -d --build
   ```

*Note: Ensure you have an external network named `web` or update the `docker-compose.yml` to match your Traefik setup.*

## 📂 Project Structure

- `/components`: UI units and page sections.
- `/context`: Global state for Admin settings and Language localization.
- `/json`: External data sources (Users, Settings, etc.).
- `/uploads`: Persistent storage for uploaded media.

---
© 2024 Forsaj Club. All Rights Reserved.
