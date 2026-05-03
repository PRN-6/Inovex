# 🦖 INOVEX 2026: BORN FROM FIRE

**INOVEX** is a high-fidelity, sci-fi themed college festival website. Inspired by the sleek, high-tech aesthetic of InGen (Jurassic Park) and dragon-inspired "Legendary" themes, this platform serves as a battle-hardened gateway for festival registrations and asset management.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: Vanilla CSS + Tailwind Utility Classes (Custom Design System)
- **Animations**: [GSAP](https://greensock.com/gsap/) (ScrollTrigger, Contextual Hover Effects)
- **State Management**: React Hooks (useForm, useMemo, useEffect)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Handling**: FormData for multi-part file uploads (Screenshots)

### Backend
- **Runtime**: Node.js / Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Asset Storage**: [Cloudinary](https://cloudinary.com/) (Multer-Storage-Cloudinary)
- **Email**: Nodemailer (SSL/TLS Secure Transport on Port 465)
- **Security**: 
    - `Express-Rate-Limit` (DDoS Mitigation)
    - `Helmet` (Header Security)
    - `CORS` (Cross-Origin Resource Sharing)
    - `Honeypot` (Bot Defense)

---

## ✨ Key Features

### 1. Smart Registration Protocol
- **Identity Sync**: Students can register for multiple events using the same USN. The system automatically merges registrations.
- **Squad Manifest**: Support for team-based events (4-player squads, 2-player duos) with real-time teammate tracking.
- **Visual Proofing**: Integrated Cloudinary upload for payment screenshots to ensure manual verification integrity.

### 2. Central Command Terminal (Admin Dashboard)
- **Bulk Actions**: Parallel processing for mass verification or data purging.
- **Real-time Analytics**: Visual Quest Distribution charts and conversion metrics.
- **Asset Intel Profile**: High-fidelity tactical view of participant data with print and copy-to-clipboard support.
- **Session Persistence**: Secured admin session recovery via encrypted localStorage.

### 3. Automated Communication
- **Verification Uplink**: Instant dispatch of confirmation emails upon admin verification.
- **Manual Resend**: Admin-controlled manual email override for edge cases.

---

## ⚙️ Environment Configuration

### Backend `.env` (`/backend/.env`)
| Variable | Description |
| :--- | :--- |
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB Atlas Connection String |
| `ADMIN_SECRET_KEY` | Key for Admin Dashboard access |
| `SUPER_ADMIN_SECRET_KEY` | Key for Super Admin (Delete/Purge rights) |
| `EMAIL_USER` | Gmail address for system notifications |
| `EMAIL_PASS` | **Google App Password** (16 characters) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Account Name |
| `CLOUDINARY_API_KEY` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret |
| `MAINTENANCE_MODE` | Set to `true` to halt registrations |

### Frontend `.env` (`/frontend/.env`)
| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | URL of the backend (Local: `http://localhost:5000`) |
| `VITE_ADMIN_SECRET_KEY` | Matches backend Admin Key |
| `VITE_SUPER_ADMIN_SECRET_KEY` | Matches backend Super Admin Key |
| `VITE_DISABLE_BACKEND` | Set to `false` for production connectivity |

---

## 🛠 Installation & Setup

### 1. Clone & Core Install
```bash
git clone https://github.com/your-repo/inovex-2026.git
cd inovex-2026
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create .env and add credentials
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
# Create .env and set VITE_API_URL
npm run dev
```

---

## 🦖 Site-B Security Protocols
- **DDoS Mitigation**: The system is capped at 10 registrations per IP per hour to prevent server exhaustion.
- **Honeypot Protection**: An invisible field `hp_field` traps automated bots instantly.
- **Encrypted Transmission**: All data is transmitted via HTTPS (production) with custom `x-admin-key` validation headers.

---

## 📜 License
**INOVEX CORE SYSTEMS - SITE-B DATA PROTOCOL.** 
All rights reserved © 2026. Built for the next generation of innovators.
