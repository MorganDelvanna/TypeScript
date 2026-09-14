# Public + Admin TypeScript App

This project provides a public home page and a password-protected admin area backed by MariaDB.

## Prerequisites

- Node.js 20 or newer, including npm
- MariaDB 10.6 or newer

## Setup

1. Create a MariaDB database and application user:

```sql
CREATE DATABASE app_database;
CREATE USER 'app_user'@'127.0.0.1' IDENTIFIED BY 'change-this-password';
GRANT ALL PRIVILEGES ON app_database.* TO 'app_user'@'127.0.0.1';
FLUSH PRIVILEGES;
```

2. Copy `.env.example` to `.env` and set the values. The admin account is not a database account: it is the password in `ADMIN_PASSWORD`.
3. Install dependencies and build:

```bash
npm install
npm run build
npm start
```

For development, use `npm run dev`.

Open `http://localhost:3000/` for the public area and `http://localhost:3000/admin` for the admin login. The announcements table is created automatically on startup.

For production, set `NODE_ENV=production`, use a long random `SESSION_SECRET`, serve behind HTTPS, and replace the default in-memory session store with a MariaDB-compatible session store.
