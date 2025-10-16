# Event Management API

A production-ready RESTful API for managing events and user registrations, built with **Node.js**, **Express**, and **PostgreSQL**. Designed for scalability, correctness, and ease of deployment.

---

## Features

- Create, view, and manage events with capacity limits
- Register/cancel user registrations with business rule enforcement
- Automatic validation (no past events, no duplicates, capacity checks)
- Efficient sorting and stats
- Ready for cloud deployment (Render + Neon)

---

## 🛠️ Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [Git](https://git-scm.com/)
- PostgreSQL database (local **or** cloud like [Neon](https://neon.tech))

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/event-management-api.git
cd event-management-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the project root:
```env
DATABASE_URL=postgres://postgres:your_password@localhost:5432/event_db
```

### 4. Create Database Tables
Run this SQL in your PostgreSQL instance (use **pgAdmin**, **psql**, or **Neon SQL Editor**):

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  datetime TIMESTAMP NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INTEGER CHECK (capacity > 0 AND capacity <= 1000)
);

CREATE TABLE IF NOT EXISTS registrations (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_events_datetime ON events(datetime);
```

### 5. Run the Application
```bash
npm run dev
```
Server starts at `http://localhost:3000`

---

## 📡 API Endpoints

All endpoints are under `/api`.

### 🔹 Events

| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| POST   | `/api/events`          | Create a new event              |
| GET    | `/api/events`          | List **upcoming** events (sorted by date ↑, then location A-Z) |
| GET    | `/api/events/:id`      | Get event details + registered users |
| GET    | `/api/events/:id/stats`| Get registration stats          |

### 🔹 Registrations

| Method | Endpoint                     | Description                     |
|--------|------------------------------|---------------------------------|
| POST   | `/api/registrations/register`| Register a user for an event    |
| POST   | `/api/registrations/cancel`  | Cancel a user’s registration    |

---

## 📥 Example Requests & Responses

### 1. Create an Event
**Request**
```http
POST /api/events
Content-Type: application/json

{
  "title": "Global Dev Summit",
  "datetime": "2025-12-10T09:00:00Z",
  "location": "San Francisco",
  "capacity": 200
}
```

**Response** `201 Created`
```json
{
  "eventId": 1
}
```

---

### 2. Register a User for an Event
**Request**
```http
POST /api/registrations/register
Content-Type: application/json

{
  "userId": 1,
  "eventId": 1
}
```

**Response** `201 Created`
```json
{
  "message": "Successfully registered"
}
```

> ❌ **Error Cases**:
> - `400`: Event is full / in the past
> - `404`: User or event not found
> - `409`: User already registered

---

### 3. Get Event Details
**Request**
```http
GET /api/events/1
```

**Response** `200 OK`
```json
{
  "id": 1,
  "title": "Global Dev Summit",
  "datetime": "2025-12-10T09:00:00.000Z",
  "location": "San Francisco",
  "capacity": 200,
  "registrations": [
    {
      "id": 1,
      "name": "Alice",
      "email": "alice@example.com"
    }
  ],
  "totalRegistrations": 1
}
```

---

### 4. Get Event Stats
**Request**
```http
GET /api/events/1/stats
```

**Response** `200 OK`
```json
{
  "totalRegistrations": 1,
  "remainingCapacity": 199,
  "capacityUsedPercentage": 1
}
```

---

### 5. List Upcoming Events
**Request**
```http
GET /api/events
```

**Response** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Global Dev Summit",
    "datetime": "2025-12-10T09:00:00.000Z",
    "location": "San Francisco",
    "capacity": 200
  },
  {
    "id": 2,
    "title": "AI Conference",
    "datetime": "2025-12-15T10:00:00.000Z",
    "location": "New York",
    "capacity": 300
  }
]
```

> Sorted by **date (ascending)**, then **location (A-Z)**.

---

## Rules Enforced

- ✅ Event capacity: `1 ≤ capacity ≤ 1000`
- ✅ No registration for **past events**
- ✅ No **duplicate** registrations
- ✅ Cannot register if event is **full**
- ✅ Concurrent registrations handled safely (via PostgreSQL transactions)
- ✅ Proper HTTP status codes for all errors

---

## 📁 Project Structure
```
src/
├── config/          # Database connection
├── controllers/     # Route logic
├── models/          # Database queries
├── routes/          # API endpoints
├── middleware/      # Validation
└── app.js           # Entry point
```

---
