# 🦖 INOVEX 2026: BORN FROM FIRE

**INOVEX** is a high-fidelity, sci-fi themed college festival website. Inspired by the sleek, high-tech aesthetic of InGen (Jurassic Park) and dragon-inspired "Legendary" themes, this platform serves as a battle-hardened gateway for festival registrations.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: Tailwind CSS (Custom Design System)
- **Animations**: [GSAP](https://greensock.com/gsap/) (ScrollTrigger & Contextual)
- **State Management**: React Hooks (useForm, useMemo)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: Node.js / Express.js
- **Database**: MongoDB Atlas (Mongoose)
- **Email**: Nodemailer (Pooled Connection / Background Processing)
- **Security**: Express-Rate-Limit, Helmet, & Honeypot Protection

---

## ✨ Key Features

### 1. Smart Registration Protocol
- **Identity Sync**: Students can register for multiple events at different times using the same USN. The system automatically merges their registrations into a single profile.
- **Squad Manifest**: Support for team-based events with real-time teammate tracking.
- **Conflict Resolution**: Prevents users from registering for the same event twice while allowing them to sign up for new ones.
- **Spam Defense**: 3-layer protection including IP-based Rate Limiting, Unique Database Constraints, and invisible Honeypot fields.

### 2. Central Command Terminal (Admin)
- **Triple-Tier Clearance**: 
    - **Event Heads**: Restricted access to view only registrations for their specific event.
    - **Admin**: General view-only access to the entire manifest.
    - **Super Admin**: Full database purge rights (DELETE) and global configuration.
- **Temporal Filtering**: Advanced high-fidelity Calendar Picker for date-based data isolation.
- **Reporting Suite**: Branded exports for Excel (.xls), Word (.doc), and CSV.

### 3. Immersive UX Design
- **Kinetic Cards**: Event cards with 3D tilt effects, eligibility ribbons, and interactive "Begin Expedition" buttons.
- **Thematic Overlays**: Dragon-themed registration success screens and ember animations.
- **Mobile Optimized**: Fully responsive layout with custom mobile navigation and touch-friendly sliders.

---

## ⚙️ Environment Configuration

### Backend `.env`
```env
# SERVER SETTINGS
PORT=5000
MONGO_URI=your_mongodb_uri

# SECURITY KEYS
ADMIN_SECRET_KEY=admin_access_key
SUPER_ADMIN_SECRET_KEY=super_admin_key

# EVENT HEAD MAPPING (JSON)
# Define access codes for each event lead
EVENT_HEAD_CODES='{"EH_TECH_2026":"Techsaurus", ...}'

# SYSTEM STATUS
MAINTENANCE_MODE=false
```

---

## 🛠 Installation & Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/your-repo/inovex-2026.git
   cd inovex-2026
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Run Development Mode**
   ```bash
   # Terminal 1 (Backend)
   cd backend && npm run dev
   
   # Terminal 2 (Frontend)
   cd frontend && npm run dev
   ```

3. **Production Build**
   ```bash
   cd frontend && npm run build
   ```

---

## 📜 License
**INOVEX CORE SYSTEMS - SITE-B DATA PROTOCOL.** 
All rights reserved © 2026. Built with precision for the next generation of innovators.
