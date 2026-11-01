# 🎓 ACADEXA – Student Course Management System

A full-stack web application where students can register, log in, browse and enroll in courses, track their learning progress, receive real-time notifications and chat with other users, while admins manage courses and students.

> **Live Frontend:**https://student-course-management-system-xi.vercel.app
> **Live Backend API:** https://acadexa-backend-7t4c.onrender.com
> **GitHub Repository:**https://github.com/Yuvashree-hub/Student-course-management-system

---

## 1. Problem Statement
Colleges and training institutes often manage student registration, course catalogues and enrollment through spreadsheets and messages, which is slow, error-prone and gives students no visibility of their progress. **ACADEXA** provides one secure, responsive platform to manage students, courses, enrollments and communication in real time.

## 2. Target Users & Requirements
| User | Needs |
|---|---|
| **Student** | Register/login securely, browse courses, enroll, track progress, get notified, chat with peers/admin, edit own profile |
| **Admin** | Add/edit/delete courses, view/delete students, see platform statistics, send announcements, chat with students |

## 3. Features
- ✅ Student registration & login with **JWT authentication** and **bcrypt** password hashing
- ✅ **Forgot / reset password** by email (one-time, 15-minute token; only its hash is stored)
- ✅ Role-based access control (student / admin) and protected routes (frontend + backend)
- ✅ Course catalogue with search and enrollment
- ✅ **Learning modules + final quiz**: read every module, then pass a 5-question quiz (3/5 to pass, unlimited retries) to complete the course - graded on the server, correct answers never sent to the browser
- ✅ **Certificate of completion** (print / save as PDF) unlocked by passing the quiz
- ✅ Student dashboard (profile, stats, enrolled courses, recent notifications)
- ✅ Admin console: course CRUD, student management, statistics, announcements
- ✅ **Real-time notifications** (Socket.IO) – new course, enrollment confirmation, completion, admin announcements
- ✅ **Real-time one-to-one chat** with online/offline status and typing indicator
- ✅ Client-side validation with error/success messages, dynamic navigation (login/logout aware)
- ✅ Responsive UI (desktop / tablet / mobile), loading & error states
- ✅ Centralized error handling, input sanitization, CORS, request logging

## 4. Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6, Redux Toolkit, Axios, socket.io-client, CSS3 (Flexbox/Grid, media queries) |
| Backend | Node.js, Express 4, Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, Socket.IO, dotenv, CORS |
| Database | MongoDB (local or MongoDB Atlas) |
| Tools | Postman, Git/GitHub, Vercel/Netlify (frontend), Render (backend) |

## 5. Folder Structure
```
Student_course_management_system/
├── README.md
├── docs/DATABASE_SCHEMA.md        # ER diagram + schema documentation
├── postman/ACADEXA.postman_collection.json
├── Backend/
│   ├── server.js                  # entry point (Express + Socket.IO + MongoDB)
│   ├── .env / .env.example
│   ├── config/db.js               # MongoDB connection
│   ├── models/                    # User, Course, Enrollment, Notification, Message
│   ├── routes/                    # URL → controller mapping
│   ├── controllers/               # request/response handling
│   ├── services/                  # business logic (auth, notifications)
│   ├── middleware/                # auth, role guard, validation, sanitize, logger, errors
│   ├── socket/index.js            # real-time chat + notifications + presence
│   ├── utils/                     # token, asyncHandler, HttpError
│   └── scripts/seed.js            # admin + demo data
└── Frontend/
    ├── index.html, vite.config.js, vercel.json
    └── src/
        ├── main.jsx, App.jsx, App.css
        ├── api/                   # axios client + API modules
        ├── store/                 # Redux Toolkit slices (auth, courses, enrollments, notifications, chat)
        ├── components/            # Navbar, Footer, CourseCard, FormField, Toast, RequireAuth, ...
        ├── hooks/useForm.js       # reusable form + validation hook
        ├── utils/                 # validation.js, storage.js, format.js
        ├── services/socket.js     # Socket.IO client
        └── pages/                 # student/ and admin/ pages
```

## 6. Setup & Run Locally

### Prerequisites
- Node.js 18+ and npm
- MongoDB – either **MongoDB Community Server** running locally, or a free **MongoDB Atlas** cluster

### Backend
```bash
cd Backend
npm install
# edit .env if needed (MONGO_URI, JWT_SECRET)
npm run seed        # creates admin, demo student, sample courses AND their lessons + quizzes (safe to run again)
npm run dev         # http://localhost:5000
```

### Frontend (new terminal)
```bash
cd Frontend
npm install
npm run dev         # http://localhost:5173
```

### Demo accounts (created by `npm run seed`)
| Role | Email | Password |
|---|---|---|
| Admin | `admin@acadexa.com` | `admin12345` |
| Student | `student@acadexa.com` | `student123` |

### Environment variables
**Backend/.env**
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/acadexa
JWT_SECRET=<long random string>
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```
**Frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 7. API Reference (base: `/api`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` (server root) | public | Server status |
| GET | `/api/health` | public | API health |
| POST | `/auth/register` | public | Register student |
| POST | `/auth/login` | public | Login → JWT |
| GET | `/auth/me` | auth | Current user |
| POST | `/auth/forgot-password` | public | Email a password-reset link `{email}` |
| POST | `/auth/reset-password/:token` | public | Set a new password `{password}` |
| GET | `/students` | admin | List students (`?search=`) |
| GET | `/students/:id` | self/admin | Get student |
| PUT/PATCH | `/students/:id` | self/admin | Update student |
| DELETE | `/students/:id` | self/admin | Delete student |
| GET | `/courses` | public | List courses |
| GET | `/courses/:id` | public | Get course |
| GET | `/courses/:id/full` | admin | Course with lesson text + quiz answers (editor) |
| POST | `/courses` | admin | Add course (optional `modules[]` and 5-question `quiz[]`) |
| PUT/PATCH | `/courses/:id` | admin | Update course |
| DELETE | `/courses/:id` | admin | Delete course |
| POST | `/enrollments` | student | Enroll `{courseId}` |
| GET | `/enrollments/me` | student | My enrollments |
| GET | `/learning/:enrollmentId` | student | Course modules, progress and (when unlocked) the quiz questions |
| POST | `/learning/:enrollmentId/modules/:moduleId/complete` | student | Mark a module complete |
| POST | `/learning/:enrollmentId/quiz` | student | Submit quiz answers `{answers:[0-3 x5]}` → score, pass/fail |
| DELETE | `/enrollments/:id` | student | Unenroll |
| GET | `/enrollments` | admin | All enrollments |
| GET | `/notifications` | auth | My notifications |
| PATCH | `/notifications/read-all` | auth | Mark all read |
| PATCH | `/notifications/:id/read` | auth | Mark one read |
| POST | `/notifications/broadcast` | admin | Announcement to all students |
| GET | `/messages/contacts` | auth | Chat contacts |
| GET | `/messages/:userId` | auth | Conversation history |
| GET | `/stats` | admin | Platform statistics |

Import `postman/ACADEXA.postman_collection.json` into Postman to test every endpoint.

**Socket.IO events:** `chat:send`, `chat:message`, `chat:typing`, `notification:new`, `presence:update` (connection authenticated with the JWT).

## 8. Database
MongoDB with 5 collections (courses embed their `modules` and 5-question `quiz`) – `users`, `courses`, `enrollments`, `notifications`, `messages`. See [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md) for the ER diagram.

## 9. Security
bcrypt password hashing (12 rounds) · JWT verification middleware · role-based authorization · input validation + NoSQL-injection sanitization · restricted CORS · secrets only in `.env` · centralized error handling (400/401/403/404/409/500) · password hash never returned by the API.

## 10. Deployment
1. **Database** – create a free cluster on MongoDB Atlas, add a DB user, allow network access (`0.0.0.0/0` for testing) and copy the `mongodb+srv://...` connection string.
2. **Backend (Render)** – New → Web Service → connect the GitHub repo.
   Root directory `Backend` · Build `npm install` · Start `npm start`.
   Environment: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN=1d`, `NODE_ENV=production`, `CLIENT_URL=<your frontend URL>`.
   After the first deploy, run the seed once from the Render shell: `npm run seed`.
3. **Frontend (Vercel/Netlify)** – Root directory `Frontend` · Build `npm run build` · Output `dist`.
   Environment: `VITE_API_URL=https://<backend>.onrender.com/api` and `VITE_SOCKET_URL=https://<backend>.onrender.com`.
4. Put the live URLs at the top of this README.

## 11. Testing Checklist
- Register → Login → JWT stored → protected routes work; no token → `401`
- Student cannot call admin endpoints → `403`
- Admin adds a course → students get a real-time notification
- Student enrolls, reads every module, passes the quiz (3/5) → course Completed → certificate
- Student cannot open the quiz before finishing all modules, and cannot skip it
- Open two browser tabs (two users) → chat messages arrive instantly
- Resize the browser (desktop / tablet / mobile) → no horizontal scrolling
