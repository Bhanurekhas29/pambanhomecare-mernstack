# Deploying Pamban Swami Home Care

One service serves everything: the website at `/`, the admin panel at `/admin`, and the API at `/api`.
With a domain such as `pambanhomecare.in`, the admin is at `https://pambanhomecare.in/admin`.

## Folder layout

```
backend/            Express API + serves the built frontend
frontend/
  src/              the public website
  src/admin/        the admin panel (loaded only on /admin)
package.json        root scripts: build and start for hosting
```

## Run on your computer

1. Copy `backend/.env.example` to `backend/.env` and fill it in (MySQL database `pamban_home_care` must exist).
2. `cd backend && npm install && npm run seed` (creates the tables, admin user and starter content).
3. Two terminals:
   - `cd backend && npm run dev` (API on port 5000)
   - `cd frontend && npm install && npm run dev` (website on http://localhost:5173, admin on http://localhost:5173/admin)

## Deploy on Render (Web Service, free plan)

| Field | Value |
|---|---|
| Root Directory | leave empty |
| Build Command | `npm run build` |
| Start Command | `npm start` |
| Instance Type | Free |

Environment variables (Render, then Environment):

| Name | Value |
|---|---|
| `DB_HOST` | database host (TiDB Cloud: from the Connect dialog) |
| `DB_PORT` | `4000` for TiDB Cloud, `3306` for MySQL |
| `DB_USER` | database user |
| `DB_PASSWORD` | database password |
| `DB_NAME` | `pamban_home_care` |
| `DB_SSL` | `true` for TiDB Cloud, otherwise leave out |
| `JWT_SECRET` | long random text |
| `JWT_EXPIRES_IN` | `1d` |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | the admin login created by the seed |
| `ADMIN_URL` | `https://<your domain>/admin` (used in password-reset links) |
| `ADMIN_EMAIL`, `ENQUIRY_EMAIL`, `SMTP_*` | the client's email settings (optional until available) |

Do not set `VITE_API_URL`: the website and admin call the API on their own address.

## First deploy: create the tables and the admin login

The tables are created automatically when the backend starts. The admin user and starter content come from the seed,
which must run once against the live database. Render's free plan has no shell, so run it from your computer:

1. Put the live database settings in `backend/.env.tidb` (never commit it) and the same `ADMIN_USERNAME` / `ADMIN_PASSWORD` as on Render.
2. Run the seed with those settings, for example by temporarily copying them into `backend/.env`, then `cd backend && npm run seed`.
3. Restore your local `.env`.

## Custom domain

In Render, Settings, Custom Domains: add `pambanhomecare.in` and point the DNS records Render shows.
Then set `ADMIN_URL` to `https://pambanhomecare.in/admin`.

## Photos

Photos uploaded in the admin are stored in the database (table `uploaded_files`), so they survive restarts on
hosts with a temporary disk. Limit: 5 MB per photo.

## Notes

- On the free plan the service sleeps after about 15 minutes without visitors; the next visit takes up to a minute.
- Secrets live in `.env` files (ignored by git). Only `backend/.env.example` is committed.
