# 🚀 KK ETHES Information System - Setup Guide

## 📋 Project Overview

**Project**: KK ETHES (Electrical Engineering & Advanced Technologies Knowledge Group) Information System  
**Organization**: Telkom University Surabaya  
**Users**: ~25 faculty members  
**Status**: Frontend UI complete → Ready for Backend + React setup

---

## ✅ Current Status (April 25, 2026)

### ✓ Completed
- [x] Frontend UI/UX Design (HTML/CSS)
  - index.html - Login/Registration page
  - dashboard.html - Main application dashboard
  - shared.css - Global styles
  - shared-nav.js - Navigation component
- [x] Design System (colors, typography, spacing)
- [x] Node.js installed
- [x] PHP installed (via XAMPP)
- [x] Composer installed
- [x] XAMPP installed and running

### ⏳ Next Steps
- [ ] Create Laravel backend project
- [ ] Setup MySQL database
- [ ] Build API endpoints
- [ ] Create React frontend app
- [ ] Connect React to Laravel API
- [ ] Implement authentication
- [ ] Deploy to production

---

## 🛠 Technology Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| Frontend | React.js | Ready to install |
| Backend | Laravel 11+ | Ready to install |
| Database | MySQL | Running (XAMPP) |
| Server | Apache | Running (XAMPP) |
| Package Manager (PHP) | Composer | ✅ Installed |
| Package Manager (JS) | npm | ✅ Installed |

---

## 📂 Project Structure (Target)

```
D:\Habibi\Project\ETHES\
├── backend/                    # Laravel API
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── .env
│   └── public/
├── frontend/                   # React app
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── node_modules/
├── ETHES_Website_Draft/        # Original HTML files (reference)
│   ├── index.html
│   ├── dashboard.html
│   ├── shared.css
│   └── shared-nav.js
└── README.md
```

---

## 🚀 Setup Instructions

### Step 1: Navigate to New Directory
```powershell
cd D:\Habibi\Project\ETHES
```

### Step 2: Create Laravel Backend Project

```powershell
# Create new Laravel project
composer create-project laravel/laravel backend

# Navigate into backend folder
cd backend
```

**What happens:**
- Composer downloads Laravel framework (~100MB)
- Creates all necessary folders (app, database, routes, etc.)
- Generates .env configuration file
- Takes ~2-3 minutes

### Step 3: Configure Laravel (.env file)

Open `D:\Habibi\Project\ETHES\backend\.env` and modify:

```env
APP_NAME=ETHES
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ethes_db
DB_USERNAME=root
DB_PASSWORD=

CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Step 4: Generate Laravel App Key

```powershell
# Inside backend folder
php artisan key:generate
```

### Step 5: Create MySQL Database

Open browser → `http://localhost/phpmyadmin` (XAMPP must be running)
1. Click "New" on left sidebar
2. Create database: `ethes_db`
3. Collation: `utf8mb4_unicode_ci`
4. Click "Create"

### Step 6: Run Laravel Migrations

```powershell
# Still in backend folder
php artisan migrate
```

**What happens:**
- Creates database tables (users, migrations, password_resets, etc.)
- Ready for backend development

### Step 7: Start Laravel Development Server

```powershell
# In backend folder
php artisan serve
```

Server runs on: `http://localhost:8000`

---

## ⚛️ Setup React Frontend (In New Terminal)

### Step 1: Navigate to Project Root

```powershell
cd D:\Habibi\Project\ETHES
```

### Step 2: Create React App

```powershell
npx create-react-app frontend
```

**Takes 3-5 minutes** - downloads React, Webpack, Babel, and dependencies

### Step 3: Install Additional Dependencies

```powershell
cd frontend

# For API calls
npm install axios

# For routing
npm install react-router-dom

# For state management (optional but recommended)
npm install @reduxjs/toolkit react-redux
```

### Step 4: Start React Development Server

```powershell
# In frontend folder
npm start
```

Server runs on: `http://localhost:3000`

---

## 🔄 Development Workflow

### Terminal 1 - Laravel Backend
```powershell
cd D:\Habibi\Project\ETHES\backend
php artisan serve
# Runs on http://localhost:8000
```

### Terminal 2 - React Frontend
```powershell
cd D:\Habibi\Project\ETHES\frontend
npm start
# Runs on http://localhost:3000
```

### Terminal 3 - XAMPP MySQL
Keep XAMPP Control Panel running (or use command line):
```powershell
# MySQL is already running via XAMPP
```

---

## 📡 API Connection (React to Laravel)

### Create API Service (`frontend/src/services/api.js`)

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
```

### Use in React Component

```javascript
import API from '../services/api';

const loginUser = async (email, password) => {
  try {
    const response = await API.post('/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

---

## 🔐 Database Schema (To Create)

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  nidn VARCHAR(50),
  program_studi VARCHAR(100),
  sub_kk VARCHAR(100),
  role ENUM('admin', 'ketua_kk', 'anggota', 'viewer'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Publications Table (Example)
```sql
CREATE TABLE publications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  type ENUM('jurnal', 'prosiding', 'hibah', 'paten', 'abdimas', 'pelatihan'),
  title VARCHAR(255),
  description TEXT,
  year INT,
  status VARCHAR(50),
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🆘 Common Commands

### Laravel
```powershell
# Create migration
php artisan make:migration create_publications_table

# Create model
php artisan make:model Publication

# Create controller
php artisan make:controller PublicationController

# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback
```

### React
```powershell
# Install package
npm install package-name

# Uninstall package
npm uninstall package-name

# Build for production
npm run build

# Run tests
npm test
```

---

## 📍 File Locations Quick Reference

| File/Folder | Location |
|------------|----------|
| Laravel .env | `D:\Habibi\Project\ETHES\backend\.env` |
| React component | `D:\Habibi\Project\ETHES\frontend\src\` |
| Laravel routes | `D:\Habibi\Project\ETHES\backend\routes\api.php` |
| Laravel database | `D:\Habibi\Project\ETHES\backend\database\migrations\` |
| phpMyAdmin | `http://localhost/phpmyadmin` |

---

## ⚠️ Troubleshooting

### "composer command not found"
- Add PHP to Windows PATH
- Restart terminal after PHP installation

### "npm command not found"
- Restart terminal after Node.js installation
- Verify: `node --version`

### "XAMPP not running"
- Open XAMPP Control Panel
- Click "Start" for Apache and MySQL

### "Port 8000/3000 already in use"
- Change port: `php artisan serve --port=8001`
- Or: `npm start` (usually finds next available port)

### Database connection error
- Verify `DB_DATABASE=ethes_db` in .env matches phpMyAdmin
- Check XAMPP MySQL is running

---

## 🎯 Next Implementation Steps (In Order)

1. **Backend Setup** (This session)
   - Create Laravel project ✓
   - Configure database ✓
   - Setup migrations ✓

2. **API Development** (Next session)
   - Build authentication endpoints
   - Create CRUD endpoints for publications
   - Setup role-based access control

3. **Frontend Development** (Next session)
   - Create React components from HTML
   - Connect to API endpoints
   - Implement state management

4. **Testing & Deployment**
   - Unit tests
   - Integration tests
   - Deploy to production server

---

## 📞 Quick Reference Links

- Laravel Docs: https://laravel.com/docs
- React Docs: https://react.dev
- Composer: https://getcomposer.org
- npm: https://www.npmjs.com

---

**Last Updated**: April 25, 2026  
**Status**: Ready for Backend Setup
