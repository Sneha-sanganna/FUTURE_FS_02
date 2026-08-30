# Client Lead Management System (Mini CRM)

A full-stack CRM application for collecting website enquiries and managing client leads.

## Features

- Admin login with JWT authentication
- Secure password hashing with bcrypt
- Lead CRUD operations
- Lead status: New / Contacted / Converted / Lost
- Notes and follow-up dates
- Search by name, email or phone
- Status filtering
- Dashboard statistics
- Public website contact form that creates leads
- Responsive UI
- MongoDB database
- REST API
- GitHub-ready project structure

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Requirements

- Node.js 18+ (Node 20+ recommended)
- MongoDB Atlas account or local MongoDB
- VS Code

## 1. Configure MongoDB

Create a MongoDB Atlas cluster and copy your connection string.

Inside `backend`, create a file named `.env` using `.env.example`:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```

Do not upload `.env` to GitHub.

## 2. Start the backend

Open a terminal:

```bash
cd backend
npm install
npm run seed
npm run dev
```

Backend runs at:

`http://localhost:5000`

## 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## 4. Demo login

Use the credentials from your `.env`:

- Email: `admin@example.com`
- Password: `Admin@123`

If you changed the values in `.env`, use your changed credentials.

## 5. Public contact form

Open:

`http://localhost:5173/contact`

Submitting the form creates a new lead in MongoDB.

## API Endpoints

### Authentication

- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

### Leads

- `POST /api/leads/public` - public contact form
- `GET /api/leads` - protected
- `GET /api/leads/stats` - protected
- `GET /api/leads/:id` - protected
- `POST /api/leads` - protected
- `PUT /api/leads/:id` - protected
- `DELETE /api/leads/:id` - protected

## Suggested GitHub description

"Full-stack Client Lead Management System (Mini CRM) built with React, Node.js, Express and MongoDB. Includes JWT admin authentication, lead CRUD, status tracking, notes, follow-ups, search, filtering and a public contact form."

## Project structure

```text
client-lead-management-system/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Important

This project is ready for local development, but before a real production deployment you should add HTTPS, stronger production secrets, rate limiting, stricter CORS, validation, audit logging and secure token storage.
