# Event Management API

A RESTful API for managing events and user registrations.

## Setup

1. Create PostgreSQL database
2. Run schema SQL
3. `cp .env.example .env` and fill credentials
4. `npm install`
5. `npm run dev`

## Endpoints

- `POST /api/events` – Create event
- `GET /api/events` – List upcoming events
- `GET /api/events/:id` – Get event + registrants
- `GET /api/events/:id/stats` – Get stats
- `POST /api/registrations/register` – Register user
- `POST /api/registrations/cancel` – Cancel registration

## Validation & Errors

- Returns 400 for invalid input
- 404 if resource not found
- 409 on duplicate registration
- 400 if event full or in past