# FerryFlow: Real-Time Ferry Operations & Passenger Management System

**Internship Project Report**
**Student Name:** Nitin Kumar  
**Organization:** [Unified Mentor]  
**Duration:** [2 months]  

---

## ABSTRACT

FerryFlow addresses the logistical challenges and communication gaps present in traditional maritime transit systems. Historically, ferry operations rely on manual updates, resulting in delayed schedules, passenger confusion, and administrative overhead. FerryFlow solves this by providing a unified platform where passengers can view real-time schedules and book tickets, while administrators can seamlessly manage fleets, routes, and operations.

The system is developed using the MERN stack (MongoDB, Express.js, React.js, Node.js). Real-time communication is facilitated by Socket.IO, pushing live updates and alerts instantly to users. Security is maintained through a robust authentication system utilizing JSON Web Tokens (JWT) stored in HTTP-only cookies, paired with a Redis caching layer for refresh tokens and role-based access control (RBAC). Finally, the application is deployed using Netlify for the frontend and Render for the backend, ensuring a highly available and scalable cloud environment.

---

## CHAPTER 1: INTRODUCTION

### 1.1 Project Overview
FerryFlow is a comprehensive, full-stack MERN web application designed to digitize and modernize ferry operations. By integrating real-time communication protocols with a robust administrative dashboard, FerryFlow bridges the gap between operational staff and passengers, creating a seamless, transparent travel experience.

### 1.2 Problem Statement
Traditional ferry systems suffer from significant inefficiencies:
- **Lack of Real-Time Data:** Passengers are often unaware of delays or cancellations until they arrive at the terminal.
- **Manual Booking & Management:** Paper-based ticketing and static scheduling create administrative bottlenecks.
- **Poor Accessibility:** Essential transit information is difficult to access on mobile devices, deterring modern user engagement.
- **Fragmented Operations:** Fleet, route, and schedule management exist in separate, disconnected silos.

### 1.3 Objectives
1. Digitize the ferry ticketing and booking process to eliminate manual intervention.
2. Provide a modern, responsive, and accessible user interface for all devices.
3. Implement real-time notifications and live ferry status updates.
4. Establish a secure, role-based authentication and authorization system.
5. Create a centralized dashboard for administrators to manage routes, schedules, and fleet data.
6. Deploy a scalable, cloud-hosted infrastructure capable of handling concurrent users.

### 1.4 Scope

**Passenger Side:**
- **Search Ferries:** Users can query available ferries based on origin, destination, and date.
- **View Schedules:** Access dynamic, up-to-date departure and arrival timelines.
- **Booking:** Securely reserve seats and view past booking history.
- **Alerts:** Receive live broadcast alerts regarding delays or emergencies.

**Admin Side:**
- **Manage Ferries:** Register new vessels, update capacities, and change operational status.
- **Routes:** Create and configure terminal connections and transit distances.
- **Schedules:** Assign ferries to specific routes with accurate timing and fare data.
- **Operations:** Monitor system-wide analytics and broadcast real-time announcements.

---

## CHAPTER 2: TECHNOLOGY STACK & LITERATURE REVIEW

### 2.1 Frontend Technologies
- **React:** Chosen for its component-based architecture, enabling reusable UI elements and efficient state management.
- **Vite:** Utilized as the build tool for its extremely fast Hot Module Replacement (HMR) and optimized production bundling.
- **Tailwind CSS:** Selected for utility-first styling, allowing rapid UI development without writing custom CSS files.
- **DaisyUI:** Integrated as a plugin for Tailwind to provide accessible, pre-built component classes like buttons and modals.

### 2.2 Backend Technologies
- **Node.js:** Provides a fast, non-blocking, event-driven runtime ideal for handling concurrent real-time requests.
- **Express.js:** A minimalist web framework used to structure RESTful API routes and middleware securely.
- **MongoDB:** A NoSQL database chosen for its flexible schema design, handling diverse operational data seamlessly.
- **Mongoose:** An Object Data Modeling (ODM) library used to enforce schema validation and query MongoDB efficiently.

### 2.3 Additional Services & Integrations
- **JWT Authentication:** JSON Web Tokens are used for stateless, secure user authorization across requests.
- **Redis:** An in-memory data store utilized to manage and validate long-lived refresh tokens securely.
- **Socket.IO:** Enables bi-directional, event-based communication between the server and clients for live status updates.
- **Nodemailer:** Handles automated outgoing communications, specifically for OTP email verification.
- **Google OAuth:** Provides a frictionless, secure single sign-on (SSO) alternative for passenger registration and login.

---

## CHAPTER 3: SYSTEM DESIGN & ARCHITECTURE

### 3.1 High Level Architecture
FerryFlow utilizes a decoupled client-server architecture. The React Frontend acts as the presentation layer, consuming data via a REST API. The Express Backend processes these HTTP requests, applies business logic, and interacts with MongoDB.

```text
[ React Frontend ]  --->  [ REST API ]  --->  [ Express Backend ]  --->  [ MongoDB ]
```

**Additional Services:**
- **Redis:** Sits alongside the backend to validate refresh tokens instantly.
- **Socket.IO:** Bypasses standard HTTP request-response cycles, maintaining open WebSocket connections to push data to the React Frontend.
- **Email Service:** Triggered by the backend to dispatch SMTP messages via Nodemailer.

*(Suggested Architecture Diagram)*  
`![System Architecture](assets/system_architecture.png)`

### 3.2 Database Design
The MongoDB database is normalized into several core collections to maintain data integrity.

| Collection | Purpose | Important Fields |
| :--- | :--- | :--- |
| **User** | Manages accounts and authentication | `name`, `email`, `password`, `role`, `isVerified` |
| **Ferry** | Stores vessel specifications | `name`, `registrationNumber`, `capacity`, `status` |
| **Route** | Defines transit paths | `name`, `origin`, `destination`, `distance` |
| **Schedule**| Maps ferries to routes over time | `ferryId`, `routeId`, `departureTime`, `fare` |
| **Booking** | Records passenger reservations | `userId`, `scheduleId`, `seats`, `paymentStatus` |
| **Alert** | Stores system broadcasts | `title`, `message`, `type`, `isActive` |
| **OTP** | Handles email verification tokens | `email`, `otp`, `expiresAt` |

### 3.3 Authentication Architecture
The authentication flow is designed for high security and seamless user experience:
1. **Registration:** Users sign up with an email and password.
2. **OTP Verification:** A 6-digit OTP is generated, hashed, and emailed. The user must submit it to verify their account.
3. **Password Hashing:** Passwords are mathematically hashed using bcrypt before database insertion.
4. **JWT Access Token:** Upon login, a short-lived access token is generated and stored in an HTTP-only cookie.
5. **Refresh Token & Redis:** A cryptographically secure refresh token is generated, stored in Redis, and attached to a long-lived HTTP-only cookie to silently renew expired access tokens.

### 3.4 Role Based Access Control (RBAC)
System resources are strictly protected at both the UI and API levels based on user roles:
- **Admin:** Has complete management access. Can create, read, update, and delete all entities across the platform.
- **Staff:** Granted specialized access to handle customer support, view operational data, and trigger alerts without the ability to mutate core structural data.
- **Passenger:** Restricted to public-facing services including viewing schedules, booking tickets, and managing their own profile.

---

## CHAPTER 4: IMPLEMENTATION DETAILS

### 4.1 User Authentication
FerryFlow provides a comprehensive authentication suite:
- **Register & Login:** Secure standard credential flows.
- **Email Verification:** Mandates email ownership confirmation before granting booking privileges.
- **Forgot Password:** Secure account recovery via OTP.
- **Google OAuth:** One-click onboarding utilizing Google's identity services.

`![Register Page](assets/01_register_page.png)`  
`![Email Verification](assets/02_email_verification.png)`  
`![Login Page](assets/03_login_page.png)`  

### 4.2 Passenger Module
The passenger interface is optimized for discovery and conversion:
- **Landing Page:** A visually engaging entry point highlighting services and urgent alerts.
- **Ferry Search:** A dynamic search engine filtering routes by origin, destination, and dates.
- **Schedule Viewing:** Clear, chronological presentation of available transit options.
- **Booking Process:** A streamlined, multi-step flow to select seats and confirm reservations.

`![Landing Page](assets/04_landing_page.png)`  
`![Ferry Search](assets/05_ferry_search.png)`  
`![Booking Page](assets/06_booking_page.png)`  

### 4.3 Admin Dashboard
Administrators utilize a protected, analytical dashboard for operational oversight:
- **Dashboard:** High-level metrics aggregating user counts, revenue, and active routes.
- **Ferry CRUD:** Interface to manage the physical fleet.
- **Route Management:** Tools to establish and edit geographic terminal connections.
- **Schedule Management:** Complex forms to pair ferries and routes with precise timeframes.

`![Admin Dashboard](assets/07_admin_dashboard.png)`  
`![Ferry Management](assets/08_ferry_management.png)`  
`![Schedule Management](assets/09_schedule_management.png)`  

### 4.4 Real-Time Features
Socket.IO is implemented to eliminate the need for manual page refreshes:
- **Live Ferry Status:** Any administrative change to a ferry's status (e.g., "Boarding", "Delayed") is immediately broadcasted to all active clients viewing that schedule.
- **Admin Broadcast:** Global alerts triggered by admins appear instantly as toast notifications across passenger screens.

`![Live Status](assets/10_live_status.png)`  

### 4.5 Security Implementation
- **JWT Cookies:** Tokens are flagged as `HttpOnly` to prevent Cross-Site Scripting (XSS) attacks.
- **Password Hashing:** Ensures database breaches do not expose plaintext user passwords.
- **Rate Limiting:** IP-based throttling is applied to authentication endpoints to mitigate brute-force and DDoS attempts.
- **Validation:** Extensive request payload validation using libraries like Joi/Zod to prevent injection attacks.
- **RBAC:** Backend middleware actively rejects requests from unauthorized role levels.

---

## CHAPTER 5: DEPLOYMENT & INTEGRATION

### 5.1 Real-Time Communication Implementation
Socket.IO is integrated to provide real-time communication between the server and connected users. The real-time module supports:
- Instant operational alerts.
- Ferry status updates.
- Live communication between server and clients.

This allows users to receive important updates without manually refreshing the application.

### 5.2 Backend API and Database Integration
The backend follows a modular Express.js architecture with separate responsibilities for routes, controllers, services, and models. The implementation includes:
- REST API endpoints for frontend communication.
- Middleware for authentication and authorization.
- Mongoose models for MongoDB data management.
- Validation and error handling mechanisms.
- Secure database operations.

MongoDB Atlas is used for cloud database hosting. The database stores entities such as users, ferries, routes, schedules, bookings, alerts, and OTP verification records.

---

## CHAPTER 6: TESTING AND VALIDATION

### 6.1 Testing Overview
Testing is an important phase in the FerryFlow development lifecycle to ensure that the application functions correctly, securely, and reliably. The major testing activities include:
- **Backend API Testing:** Validating API endpoints, authentication flows, and server responses.
- **Frontend Interface Testing:** Checking UI behaviour, responsiveness, and user interactions.
- **End-to-End Testing:** Simulating complete user workflows using browser automation.
- **Real-Time Feature Validation:** Verifying real-time communication features implemented using Socket.IO.
- **Security Validation:** Testing authentication, authorization, and protected routes.

### 6.2 Testing Strategy
| Testing Type | Tool/Framework | Purpose |
| :--- | :--- | :--- |
| **Unit Testing** | Jest | Testing backend functions, services, and business logic. |
| **API Testing** | Supertest | Validating REST API endpoints, responses, and error handling. |
| **End-to-End Testing** | Playwright | Testing complete user workflows through browser automation. |
| **Manual Testing** | Browser Testing | Checking UI behaviour, responsiveness, and usability. |

### 6.3 Backend API Testing
The authentication module was tested for:
- User registration and Email OTP verification flow.
- Login functionality and invalid credential handling.
- Logout functionality.
- Google OAuth authentication.

| API Endpoint | Expected Result | Status |
| :--- | :--- | :--- |
| `POST /api/v1/auth/register` | Create new user account | Passed |
| `POST /api/v1/auth/login` | Authenticate valid user and create session | Passed |
| `POST /api/v1/auth/logout` | Logout user and invalidate session | Passed |
| `POST /api/v1/auth/verify-email` | Verify OTP and activate account | Passed |

### 6.4 End-to-End Testing Using Playwright
Playwright was used to validate complete user workflows from the browser perspective:
1. Opening the FerryFlow application.
2. Navigating to authentication pages.
3. Entering user credentials.
4. Completing authentication workflow.
5. Accessing protected pages (Dashboard).
6. Logging out.

`![Playwright E2E Test](screenshots/playwright-test.png)`

### 6.5 Overall Test Results
| Test Scenario | Result |
| :--- | :--- |
| User Registration and Validation | **Passed** |
| OTP Email Verification | **Passed** |
| Google OAuth Login | **Passed** |
| Protected Route and Role-Based Access | **Passed** |
| Frontend Workflow & API Endpoint Validation | **Passed** |

---

## CHAPTER 7: CONCLUSION AND FUTURE ENHANCEMENTS

### 7.1 Conclusion
The FerryFlow project demonstrates the development of a modern web-based ferry operations and passenger management system. The application provides a centralized platform that connects passengers, staff members, and administrators to efficiently manage ferry-related services.

Developed using the MERN stack (MongoDB, Express.js, React.js, Node.js), the implemented features include secure user authentication, OTP-based email verification, Google OAuth login, ferry management, route scheduling, role-based dashboards, and real-time operational notifications via Socket.IO.

Overall, FerryFlow provides a reliable foundation for digital ferry management and demonstrates the practical application of modern full-stack technologies for solving real-world transportation management challenges.

### 7.2 Future Enhancements
- **Live GPS-Based Ferry Tracking:** Integrating GPS devices with ferries to display real-time locations and estimated arrival times through interactive maps.
- **Interactive Maps and Route Visualization:** Visualizing ferry routes, terminals, and location-based information for passengers.
- **Mobile Application Development:** A dedicated Android and iOS app to provide features like push notifications and mobile ticket access.
- **Online Payment and Digital Ticketing:** Complete payment gateway integration and automated boarding verification.
- **Advanced Analytics Dashboard:** Features for administrators to monitor passenger demand, route performance, and booking trends.
- **AI-Based Assistance:** Chatbots to help passengers quickly access schedules and service-related queries.
- **Progressive Web Application (PWA):** Extending the platform to provide faster loading, offline support, and app-like functionality.

---

## REFERENCES
- MongoDB Inc., MERN Stack Documentation. [https://www.mongodb.com/mern-stack](https://www.mongodb.com/mern-stack)
- Meta Open Source, React Documentation. [https://react.dev/](https://react.dev/)
- Node.js Foundation, Node.js Documentation. [https://nodejs.org/docs](https://nodejs.org/docs)
- Express.js, Express Framework Documentation. [https://expressjs.com/](https://expressjs.com/)
- Socket.IO, Socket.IO Documentation. [https://socket.io/docs/](https://socket.io/docs/)
- Auth0, JSON Web Token Documentation. [https://jwt.io/](https://jwt.io/)
- Jest Team, Jest Documentation. [https://jestjs.io/docs](https://jestjs.io/docs)
- Microsoft, Playwright Documentation. [https://playwright.dev/docs](https://playwright.dev/docs)
- Tailwind Labs, Tailwind CSS Documentation. [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- Google, Google Identity Services Documentation. [https://developers.google.com/identity](https://developers.google.com/identity)