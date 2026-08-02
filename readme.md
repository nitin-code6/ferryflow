<div align="center">
  <img src="client/src/assets/ferry-logo.png" alt="FerryFlow Logo" width="120" />
  <h1>⛴️ FerryFlow</h1>
  <p><strong>Real-Time Ferry Operations & Passenger Management System</strong></p>
  
  [![React](https://img.shields.io/badge/React-19.2-blue?logo=react&logoColor=white)](https://react.dev)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js&logoColor=white)](https://nodejs.org)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
  [![Socket.IO](https://img.shields.io/badge/Socket.IO-Real%20Time-black?logo=socket.io)](https://socket.io)
  [![Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7?logo=netlify)](https://ferryflow.netlify.app)
</div>

---

FerryFlow is a full-stack, real-time web platform built to modernize maritime transportation. It bridges the gap between passengers and operational staff by offering live schedule tracking, secure ticket booking, instant operational alerts, and a comprehensive administrative dashboard. 

## 🌐 Live Demo & Demonstration
- **Production Build:** [https://ferryflow.netlify.app/](https://ferryflow.netlify.app/)
- **Video Demonstration:** [https://youtu.be/MVJt-MybjTQ](https://youtu.be/MVJt-MybjTQ)

---

## 📸 Screenshots

| Landing Page | Authentication & Login | User Dashboard |
| :---: | :---: | :---: |
| <img src="client/src/assets/landing.png" alt="Landing Page" width="300" /> | <img src="client/src/assets/auth.png" alt="Authentication" width="300" /> | <img src="client/src/assets/dashboard.png" alt="Dashboard" width="300" /> |

| System Architecture | Automated E2E Testing |
| :---: | :---: |
| <img src="client/src/assets/systemArchitecture.png" alt="System Architecture" width="300" /> | <img src="client/src/assets/playright.png" alt="Playwright Tests" width="300" /> |

---

## ✨ Features

### 🛡️ Authentication & Security
- **JWT & HTTP-Only Cookies:** Secure, stateless session management.
- **Refresh Token Rotation:** Handled via Redis for seamless and secure session renewal.
- **Google OAuth Integration:** One-click registration and login.
- **Email OTP Verification:** Validates user identity using Nodemailer.
- **Role-Based Access Control (RBAC):** Strict permissions separating `Passenger`, `Staff`, and `Admin`.

### 👨‍💼 Administrative & Staff Capabilities
- **Fleet Management:** Register new ferries, update vessel capacities, and manage operational status.
- **Route Definitions:** Establish physical terminals and geographic transit paths.
- **Schedule Orchestration:** Pair specific vessels to routes and assign accurate departure/arrival timelines.
- **Global Broadcasts:** Dispatch live, system-wide alerts to passengers.

### ⛴️ Passenger Services
- **Dynamic Search:** Filter and find ferries based on origin, destination, and dates.
- **Real-Time Dashboards:** Live tracking of ferry operational status ("Boarding", "Delayed", etc.).
- **Secure Ticketing:** Multi-step ticket reservation workflow (with Razorpay integration readiness).

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS 4 & DaisyUI
- **Routing:** React Router 7
- **Forms & Validation:** React Hook Form & Zod
- **Icons:** Lucide React & React Icons

### Backend
- **Runtime & Framework:** Node.js & Express.js 5
- **Database:** MongoDB (using Mongoose ODM)
- **Caching & Sessions:** Redis
- **Authentication:** JSON Web Tokens (JWT), Google Auth Library, bcrypt
- **Real-Time Communication:** Socket.IO
- **Email Service:** Nodemailer

### Deployment & Tools
- **Frontend Hosting:** Netlify
- **Backend Hosting:** Render
- **Testing:** Playwright (E2E), Jest & Supertest (API)
- **Package Manager:** npm

---

## 🏗️ Architecture

FerryFlow implements a **decoupled Client-Server architecture**. 
The React frontend acts as a Single Page Application (SPA) consuming RESTful JSON APIs exposed by the Node/Express backend. 

### Request Flow
1. **Client Request:** The user interacts with the React UI.
2. **API Call:** Axios dispatches an HTTP request to the Express Backend.
3. **Middleware Interception:** Requests pass through CORS, Rate Limiting, and JWT Validation middleware.
4. **Controller Logic:** Business logic is processed, interacting with Mongoose for MongoDB reads/writes or Redis for token validation.
5. **Real-Time Push:** If an operational state changes, Socket.IO bypasses the traditional HTTP response cycle and emits a real-time event directly to all connected React clients.

---

## 🚀 Installation & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URL)
- [Redis](https://redis.io/) (Local or Cloud instance)

### 1. Clone the Repository
```bash
git clone https://github.com/nitin-code6/ferryflow.git
cd ferryflow
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory (see Environment Variables table below).
Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory (see Environment Variables table below).
Start the frontend development server:
```bash
npm run dev
```

---

## 🔐 Environment Variables

### Backend (`server/.env`)
| Variable | Description | Required |
| :--- | :--- | :---: |
| `PORT` | The port the Express server runs on (e.g., 8000) | ✅ |
| `MONGO_URI` | MongoDB connection string | ✅ |
| `REDIS_URL` | Redis connection URL | ✅ |
| `JWT_SECRET` | Secret key for signing Access Tokens | ✅ |
| `JWT_REFRESH_SECRET` | Secret key for signing Refresh Tokens | ✅ |
| `GOOGLE_CLIENT_ID` | OAuth Client ID from Google Cloud Console | ✅ |
| `EMAIL_USER` | SMTP email address for Nodemailer | ✅ |
| `EMAIL_PASS` | SMTP app password for Nodemailer | ✅ |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID (for payments) | ❌ |
| `RAZORPAY_KEY_SECRET`| Razorpay API Secret (for payments) | ❌ |
| `CLIENT_URL` | Allowed CORS origin (e.g., `http://localhost:5173`) | ✅ |

### Frontend (`client/.env`)
| Variable | Description | Required |
| :--- | :--- | :---: |
| `VITE_API_URL` | URL of the backend REST API | ✅ |
| `VITE_SOCKET_URL` | URL of the backend for Socket.IO | ✅ |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID (must match backend) | ✅ |

---

## 📡 API Overview

The backend exposes grouped RESTful resources. All protected routes require a valid HTTP-Only JWT Cookie.

### Authentication (`/api/v1/auth`)
- `POST /register` - Create a new user account.
- `POST /login` - Authenticate and receive HttpOnly cookies.
- `POST /google` - Handle Google OAuth credential exchange.
- `POST /verify-email` - Verify user via OTP.
- `POST /refresh-token` - Rotate JWT access tokens via Redis.

### Ferries & Routes (`/api/v1/ferries`, `/api/v1/routes`)
- `GET /` - Retrieve available entities.
- `POST /` - (Admin Only) Create new vessels or terminal routes.
- `PUT /:id` - (Admin/Staff) Update statuses or capacities.

*(Schedules, Bookings, and Alerts follow similar CRUD patterns).*

---

## 🔑 Authentication Flow

1. **Standard Login:** User submits email/password. Server hashes input, validates against DB, and generates a short-lived `AccessToken` and a long-lived `RefreshToken`.
2. **Token Storage:** The `AccessToken` is set as an `HttpOnly` cookie. The `RefreshToken` is saved to **Redis** and also sent as an `HttpOnly` cookie.
3. **Session Renewal:** When the `AccessToken` expires, the frontend calls `/refresh-token`. The server validates the cookie against Redis and issues a new access token seamlessly.
4. **Google OAuth:** React utilizes `@react-oauth/google` popup flow. The credential token is sent to the backend, validated via `google-auth-library`, and immediately integrated into the standard JWT flow above.

---

## 🗄️ Database Design

The schema is built in Mongoose with tight relational references:
- **User:** Defines identity, hashed passwords, and RBAC `role` (passenger, staff, admin).
- **Ferry:** Stores vessel data (`name`, `capacity`, `registrationNumber`).
- **Route:** Stores geometric representations of origin to destination paths.
- **Schedule:** The pivot collection connecting `Ferry` + `Route` + Time.
- **Booking:** Connects `User` + `Schedule` + Seat allocations.
- **OTP:** Temporary records with TTL (Time-To-Live) indexes for email verification.

---

## 📁 Project Structure

```text
ferryflow/
├── client/                     # React / Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable atomic UI parts
│   │   ├── context/            # React Context (Auth State)
│   │   ├── pages/              # Route-level views (Login, Dashboards)
│   │   ├── services/           # Axios network calls
│   │   └── Validations/        # Zod schemas for forms
│   └── .env
└── server/                     # Express / Node.js Backend
    ├── src/
    │   ├── config/             # DB & 3rd Party init (Redis, Google)
    │   ├── controllers/        # Route logic and HTTP responses
    │   ├── middleware/         # Auth verification, Error Handling
    │   ├── models/             # Mongoose schemas
    │   ├── routes/             # Express router definitions
    │   └── utils/              # Nodemailer helpers, JWT signers
    ├── tests/                  # Jest & Supertest suites
    └── .env
```

---

## 📖 Usage

1. **Passenger Registration:** Navigate to the site, register via Email or Google, and verify your OTP.
2. **Find a Ferry:** Enter your departure and arrival locations to view live schedules.
3. **Book a Ticket:** Select an available schedule, choose your seats, and complete the reservation workflow.
4. **Admin Testing:** Log into an Admin account to manage the fleet, assign schedules, and push live Socket.IO alerts to active passengers.

---

## 🌍 Deployment

- **Frontend (Netlify):** Connected directly to the GitHub repository. Vite's build command (`npm run build`) is executed automatically, and static files are served via Netlify's global CDN. Environment variables are set in the Netlify Dashboard.
- **Backend (Render):** Deployed as a Web Service on Render. The server starts via `node src/server.js`. Secrets are managed in Render's Environment settings.

---

## 🔮 Future Improvements
- **Live GPS Tracking:** Integrating physical IoT GPS sensors to visually track ferries on an interactive web map.
- **Mobile Native Apps:** Porting the React codebase to React Native for iOS/Android stores with native push notifications.
- **QR Code Ticketing:** Generating unique QR codes upon booking for automated scanning at physical boarding gates.

---

## 🤝 Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License
This project is licensed under the ISC License.

## 👤 Author
**Nitin Kumar**
- GitHub: [nitin-code6](https://github.com/nitin-code6)