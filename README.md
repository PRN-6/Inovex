# 🦖 INOVEX 2026: BORN FROM FIRE

**INOVEX** is a high-fidelity, sci-fi themed college festival website. Inspired by the sleek, high-tech aesthetic of InGen (Jurassic Park), this platform serves as the digital gateway for participants to register for legendary events, track timelines, and explore festival personnel.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [GSAP](https://greensock.com/gsap/) (GreenSock Animation Platform)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Routing**: [React Router DOM](https://reactrouter.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- **ODM**: [Mongoose](https://mongoosejs.com/)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **Security**: [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) & [Dotenv](https://www.npmjs.com/package/dotenv)

---

## ✨ Key Features

- **Thematic Registration**: A fully validated multi-field registration form with "InGen" styling.
- **Automated Email Confirmation**: Instant, thematic HTML emails sent to participants upon successful registration.
- **Responsive "Dragon Theme" UI**: Custom-tailored layouts for mobile and desktop, including a glass-morphic mobile navigation system.
- **Visual Excellence**: Floating ember effects, smooth GSAP transitions, and backdrop-blur dashboard interfaces.
- **Database Integration**: Secure storage of participant data including USN, department, and event selection.

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- A MongoDB Atlas Cluster
- A Gmail account (for automated emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd college-fest-website-0.6
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Setup Backend**
   ```bash
   cd ../backend
   npm install
   ```

### Environment Variables
Create a `.env` file in the `backend` directory with the following keys:
```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_16_char_gmail_app_password
```

---

## 📁 Project Structure

```text
├── frontend/
│   ├── src/
│   │   ├── components/    # Navbar and Reusable UI
│   │   ├── pages/         # Home, Events, Register, Team, About
│   │   ├── data/          # Event and Personnel data
│   │   └── styles/        # Global CSS and Tailwind configs
├── backend/
│   ├── models/            # Mongoose Schema (User.js)
│   ├── utils/             # Email Service (emailService.js)
│   ├── server.js          # Main Entry Point
│   └── .env               # Secret Configuration
```

---

## 🛡 License
This project is for the **INOVEX 2026** College Festival. 

**"Your path is forged. Prepare for the expedition."**
