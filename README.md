# 🦖 INOVEX 2026: BORN FROM FIRE

**INOVEX** is a high-fidelity, sci-fi themed college festival website. Inspired by the sleek, high-tech aesthetic of InGen (Jurassic Park) and dragon-inspired "Legendary" themes, this platform serves as a battle-hardened gateway for festival registrations.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: Vanilla CSS & Tailwind (Custom Hybrid)
- **Animations**: [GSAP](https://greensock.com/gsap/) & Framer Motion
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: Node.js / Express.js
- **Database**: MongoDB Atlas (Mongoose)
- **Email**: Nodemailer (Pooled Connection)
- **Stress Testing**: k6.io

---

## ✨ Key Features

### 1. Advanced Registration Protocol
- **Direct Submission**: Fast, no-payment model for immediate registration.
- **Squad Manifest**: Support for team-based events (RexHack, Spy vs Spy) with teammate USN tracking.
- **Speed Hack**: Non-blocking background email processing, resulting in **<150ms response times** under heavy load.

### 2. Central Terminal (Admin Panel)
- **Dual-Tier Clearance**: 
    - **Normal Admin**: View-only access to participant manifest.
    - **Super Admin**: Full purge rights (DELETE) to manage asset database.
- **Reporting Suite**: One-click exports for:
    - **Excel (.xls)**: Full database manifest with team details.
    - **Word (.doc)**: Professional, branded event reports.
    - **CSV**: Raw data for external processing.
- **Dynamic Search**: Real-time USN and name filtering.

### 3. Site-B Maintenance Mode
- **Instant Toggle**: Controlled via environment variables (`MAINTENANCE_MODE`).
- **Expedition Countdown**: Real-time countdown timer to inform users when registrations reopen.
- **Admin Bypass**: The Admin Terminal remains operational even during maintenance.

---

## 🚀 Performance & Scaling
Tested via **k6** to handle extreme traffic:
- **Concurrent Users**: 500+ Virtual Users (VUs)
- **Throughput**: ~15,000 registrations in 2 minutes.
- **Reliability**: 0.00% failure rate under peak stress.

---

## ⚙️ Environment Configuration

### Backend `.env`
```env
PORT=5000
MONGO_URI=your_mongodb_uri
EMAIL_USER=your_gmail
EMAIL_PASS=your_app_password
ADMIN_SECRET_KEY=level_1_key
SUPER_ADMIN_SECRET_KEY=super_admin_key
MAINTENANCE_MODE=false
MAINTENANCE_UNTIL=2026-04-26T18:00:00Z
```

### Frontend `.env`
```env
VITE_ADMIN_SECRET_KEY=level_1_key
VITE_SUPER_ADMIN_SECRET_KEY=super_admin_key
```

---

## 🛠 Installation & Setup

1. **Clone & Install**
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Run Development Mode**
   ```bash
   # Terminal 1 (Backend)
   npm run dev
   
   # Terminal 2 (Frontend)
   npm run dev
   ```

3. **Load Testing (Optional)**
   ```bash
   k6 run load_test.js
   ```

---

## 📜 License
INOVEX CORE SYSTEMS - SITE-B DATA PROTOCOL. 
All rights reserved © 2026.
