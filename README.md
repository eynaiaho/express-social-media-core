# Auth API

> This project is currently on hold and will be continued. The authentication layer is complete and designed with production-grade security practices in mind.

A secure, production-grade RESTful authentication API built with Node.js and Express.js. Implements industry-standard security practices including refresh token rotation, session management, and anomaly detection.

---

## Features

- **JWT Authentication** — Short-lived access tokens (15m) with `iss`, `aud`, `jti`, and `sid` claims
- **Refresh token rotation** — Cryptographically random refresh tokens, HMAC-SHA256 hashed before storage; every refresh invalidates the previous token
- **Session management** — Per-device sessions tracked in the database with IP address and User-Agent
- **Anomaly detection** — Requests are scored by comparing session metadata (browser, OS, IP) against the incoming request; suspicious activity raises a critical level flag
- **Input validation** — Joi schemas with detailed, localized error messages on every endpoint
- **Database transactions** — Registration and token rotation use atomic transactions with automatic rollback on failure
- **Global error handler** — Centralized error handling middleware; controllers never leak stack traces to the client
- **Ban system** — Banned users are rejected at both login and token refresh

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MySQL (mysql2/promise) |
| Auth | JSON Web Tokens (jsonwebtoken) |
| Password hashing | bcrypt (12 rounds) |
| Validation | Joi |
| Token generation | Node.js crypto |
| Session storage | MySQL connection pool |

---

## Project Structure

```
├── app.js                          # Express app entry point
├── config/
│   └── db.js                       # MySQL connection pool
├── routes/
│   └── v1/
│       └── auth.route.js           # Auth route definitions
├── controllers/
│   └── auth.controller.js          # Request/response handling
├── services/
│   └── auth.service.js             # Business logic
├── models/
│   ├── user.model.js               # User database queries
│   └── session.model.js            # Session database queries
├── middlewares/
│   ├── auth.middleware.js           # JWT verification
│   └── validate.middleware.js       # Joi validation wrapper
├── validators/
│   └── auth.validator.js           # Joi schemas
└── utils/
    ├── tokens.util.js              # Token creation and hashing
    └── security.util.js            # Anomaly detection
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Register a new user |
| `POST` | `/api/v1/auth/login` | Login with email and password |
| `POST` | `/api/v1/auth/refresh` | Rotate refresh token |
| `POST` | `/api/v1/auth/logout` | Revoke session |

---

## Security Design

**Refresh tokens** are never stored in plain text. A raw token is sent to the client via `httpOnly`, `sameSite: strict` cookie; only its HMAC-SHA256 hash is persisted in the database. If the database is compromised, tokens cannot be replayed.

**Token rotation** is atomic — the old session is revoked and the new one is created inside a single database transaction. A failure at any point rolls back both operations.

**Anomaly scoring** compares the browser name, operating system, and IP address of the incoming request against the values stored at session creation. A score above the threshold flags the request as suspicious.

**Access tokens** embed `jti` (unique token ID), `sid` (session ID), `iss` (issuer), and `aud` (audience) claims alongside the standard `sub` and `exp`.

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=auth_db

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m

REFRESH_SECRET=your_refresh_secret
REFRESH_EXPIRES_IN=7d

APP_ISS=your_app_name
APP_AUD=your_app_audience

NODE_ENV="development"
```

---

## Getting Started

```bash
npm install
# configure your .env file
node app.js
```

---

## Roadmap

- [ ] Email verification flow
- [ ] Password reset
- [ ] Rate limiting
- [ ] `security.util.js` integration into the refresh flow
- [ ] Swagger / OpenAPI documentation

---

## License

MIT

## Author

**Ahmet Cihan** — [@eynaiaho](https://github.com/eynaiaho)
