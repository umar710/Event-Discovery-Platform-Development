# Event Discovery Platform - Backend API

Live API: `https://event-discovery-platform-development.onrender.com`

## 🚀 Quick Start

```bash
# Clone & install
git clone <your-repo>
cd server
npm install

# Set up environment (.env)
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development

# Seed database & start
npm run seed
npm run dev
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/events` | Get all events (with filters) |
| GET | `/api/events/:id` | Get single event |
| POST | `/api/registrations` | Register for event |
| DELETE | `/api/registrations/:eventId` | Cancel registration |
| GET | `/api/registrations/my-registrations` | Get user's registrations |

## 🛠️ Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs
- Render (deployment)

## 📦 Deployment

1. Push to GitHub
2. Connect repo to Render
3. Add environment variables
4. Deploy!

## 🔒 Environment Variables

```
PORT
MONGODB_URI
JWT_SECRET
JWT_EXPIRE
NODE_ENV
```

## 📁 Folder Structure

```
server/
├── models/     # Mongoose schemas
├── routes/     # API endpoints
├── middleware/ # Auth guard
├── server.js   # Entry point
└── seed.js     # Mock data
```
