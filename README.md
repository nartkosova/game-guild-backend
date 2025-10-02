# GameGuild API

Production-grade Node.js backend for GameGuild using Express + Mongoose with secure JWT auth, input validation, rate limiting, and centralized error handling.

## Prerequisites

- Node.js 18+
- MongoDB 5+

## Setup

1. Copy `.env.example` to `.env` and adjust values
2. Install dependencies

```
npm install
```

3. Run in dev (with nodemon)

```
npm run dev
```

4. Or run in production

```
npm run start
```

Health check: `GET /healthz` returns `{ "status": "ok" }`.

## Environment

See `.env.example` for all variables.

- Server: `PORT`, `NODE_ENV`
- Mongo: `MONGODB_URI`
- JWT: `JWT_ACCESS_SECRET`, `JWT_ACCESS_EXPIRES`
- CORS: `CORS_ORIGIN`
- Cookies: `COOKIE_SECURE`, `COOKIE_DOMAIN`

## Project Structure

```
src/
  server.js          # start server & connect DB
  app.js             # middleware, routes, error handling
  config/
    env.js           # env vars from dotenv
    db.js            # mongoose connection
  middleware/
    auth.js          # JWT requireAuth
    cors.js          # CORS (origin from env, credentials)
    error.js         # centralized error handler
    notFound.js      # 404 handler
    rateLimit.js     # auth/general rate limiters
  utils/
    passwords.js     # bcrypt hashing/verify
    pick.js          # object pick helper
  models/
    User.js
    Game.js
    GameEntry.js
  controllers/
    auth.controller.js
    users.controller.js
    games.controller.js
    friends.controller.js
  routes/
    auth.routes.js
    users.routes.js
    games.routes.js
    friends.routes.js
```

## Security

- Helmet and CORS with credentials
- JWT Auth: access tokens via `Authorization: Bearer <token>`
- Rate limits: `/auth/*` 10 req/min/IP, general 300 req/5m/IP
- Error handling: consistent JSON `{ message, code?, details? }`

## Authentication & Session

- Public endpoints: `/auth/*`, `/healthz`
- All other endpoints require `Authorization: Bearer <accessToken>`
- Register/Login return an `accessToken`. Access tokens do not expire if `JWT_ACCESS_EXPIRES=never`.

## APIs Overview

### Auth

- POST `/auth/register` { username, email, password }
- POST `/auth/login` { email, password }
- POST `/auth/logout`

### Users (auth required)

- GET `/users/me`
- PATCH `/users/me` { avatarUrl?, bio?, platformHandles? }
- DELETE `/users/me`
- GET `/users/:id`
- GET `/users/search?q=...&limit=...`

### Friends (auth required)

- GET `/friends` — list accepted friends
- GET `/friends/requests` — { incoming, outgoing }
- POST `/friends/requests/:userId`
- POST `/friends/requests/:userId/accept`
- POST `/friends/requests/:userId/decline`

### Games (auth required)

- POST `/games`
- GET `/games/:id`
- GET `/games?search=&platform=&limit=`
- PATCH `/games/:id`
- DELETE `/games/:id`

## Sample Requests

Register

```
curl -s -X POST http://localhost:3000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"player1","email":"p1@example.com","password":"Secret123"}'
```

Login

```
curl -s -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"p1@example.com","password":"Secret123"}'
```

Use access token to call protected route

```
ACCESS_TOKEN="<paste token>"
curl -s http://localhost:3000/users/me -H "Authorization: Bearer $ACCESS_TOKEN"
```

Create a game

```
curl -s -X POST http://localhost:3000/games \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"gameName":"Hades","platform":"Steam","achievementCount":49}'
```

Add an entry

```
curl -s -X POST http://localhost:3000/entries \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"gameId":"<id>","status":"Playing"}'
```

## Acceptance Checklist

- `npm run dev` runs and `/healthz` returns 200
- `/auth/register` returns `accessToken`
- `/auth/login` returns `accessToken`
- Protected routes require `Authorization: Bearer <token>`
- Users: me/get/update/delete work; search returns results
- Friends: send/accept/decline + lists are consistent for both users
- Games: CRUD works and is searchable by name/platform

## Notes

- No refresh tokens are used; set `JWT_ACCESS_EXPIRES=never` for non-expiring tokens.
- Never expose stack traces in production; error handler limits details based on `NODE_ENV`.
