# Local connectivity diagnosis — 2 November 2026

## Root cause and fix

React's active `frontend/.env` correctly supplied port 8001, confirmed by the transformed JavaScript served by Vite at `http://localhost:5175/src/utils/apiClient.js`. `.env.example` is only a template and is not read by Vite as runtime configuration. No `.env.local` or mode-specific overrides were present. Existing Vite processes were serving the same project on several ports; there was no Vite configuration pinning the desired port.

Laravel's actual `.env` still supplied `APP_URL=http://127.0.0.1:8000`, `FRONTEND_URL=http://127.0.0.1:5173` and `SANCTUM_STATEFUL_DOMAINS=127.0.0.1:5173`. Live API requests to port 8001 returned 200, but the CORS response advertised the wrong frontend origin. The browser blocked the response from `http://localhost:5175`, causing the catalogue fallback and session-check error. The frontend localhost/backend 127.0.0.1 combination also prevented a shared hostname for Sanctum cookies and Axios XSRF-cookie access.

The actual local environments and templates now use:

```dotenv
# frontend/.env
VITE_API_BASE_URL=http://localhost:8001/api

# backend/.env
APP_URL=http://localhost:8001
FRONTEND_URL=http://localhost:5175
SANCTUM_STATEFUL_DOMAINS=localhost:5175
SESSION_DRIVER=file
SESSION_DOMAIN=null
```

Axios already had `withCredentials: true`, `withXSRFToken: true`, and `Accept: application/json` on both clients. The auth client correctly removes `/api` to reach `/sanctum/csrf-cookie` and Breeze `/login`. Those settings and AuthContext did not need replacement. Laravel already had credentialed CORS, Sanctum stateful middleware, and the appropriate routes. Correcting their environment inputs fixed the mismatch; no security middleware was disabled.

`frontend/vite.config.js` now defaults to `localhost:5175` with `strictPort: true`, so future starts report an occupied port instead of silently drifting to another port. The fallback API URL in `apiClient.js` matches the corrected local defaults.

## Running servers and restarts

The desired servers were observed listening on `localhost`/IPv6 loopback port 5175 (Vite) and IPv4 loopback port 8001 (Laravel). Laravel's IPv4 listener is reachable using `http://localhost:8001`; that hostname was tested through HTTP and the browser. Other existing listeners on port 5173 and Laravel port 8000 were not terminated. Use the canonical links below instead of those older servers.

Vite automatically reloaded the environment/new Vite configuration, and Laravel's development server reloaded the `.env`; effective configuration and HTTP headers were checked afterward. `php artisan config:clear` was also run. The corrected running services have been verified; no further restart is needed to view the current result. If restarting later:

```bash
# Terminal 1, from the project root
cd backend
php artisan config:clear
php artisan serve --host=127.0.0.1 --port=8001

# Terminal 2, from the project root
cd frontend
npm run dev
```

Stop the current process on the same port with Ctrl+C before starting another copy. Vite's config pins port 5175. Database `DB_HOST=127.0.0.1`, port 3306 and credentials were not changed.

## Active database and admin account

Read-only runtime/database inspection confirmed:

- Database: `madeby_marketplace`.
- Driver: Laravel `mysql`.
- Server: XAMPP MariaDB 10.4.28, port 3306.
- Data directory: `/Applications/XAMPP/xamppfiles/var/mysql/` — XAMPP, not Homebrew MySQL.
- Current user count: **0**.
- Current admin count: **0**. Therefore no existing admin name/email can be reported.
- Administrator field: `users.is_admin = 1`/true. It is boolean-cast in `backend/app/Models/User.php`; policies check it, and public registration cannot set it.
- Catalogue seeders do not create users/admins.

No account was created, promoted, deleted, reset or otherwise changed during this task. No password/hash/token/cookie value was printed. The database remained the active XAMPP database throughout.

`backend/routes/console.php` defines `madeby:admin {email} {--name=MADEBY Admin}`. It validates the email, prompts privately for a password of at least 12 characters, hashes it, and sets `is_admin=true`. It uses `firstOrNew`, so choosing an existing email would update/promote that account and replace its password/name. Do not use it on an existing email unless you intend that change. With zero users currently present, a new email creates a new admin; this is left for the user to run intentionally.

## Verification results

| Check | Result |
| --- | --- |
| GET `http://localhost:8001/api/listings` | 200, 10 live listings |
| GET `/api/categories` | 200, seven categories |
| GET `/api/creators` | 200, six creators |
| GET `/api/user` as guest | 401, expected unauthenticated response, now readable through CORS |
| GET `/sanctum/csrf-cookie` | 204; XSRF and HttpOnly session cookies issued for localhost |
| CORS preflight OPTIONS `/login` | 204, origin `http://localhost:5175`, credentials allowed, content-type and x-xsrf-token accepted |
| POST `/login` without CSRF | 419, expected protection |
| POST `/login` with cookie + XSRF header and deliberately nonexistent credentials | 422 credential validation; confirms the CSRF/session exchange reaches authentication |
| POST `/api/listings` with CSRF but no authenticated user | 401, expected guest rejection; no data created |
| Browser homepage at `http://localhost:5175/` | Catalogue displayed with no fallback or loading banner after queries completed; live HTTP catalogue requests succeeded |
| Browser `/admin` | Redirected to `/admin/login`; no “Unable to check your session” error |
| Browser Axios login with deliberately nonexistent credentials | Laravel credential validation displayed, rather than CORS/network/CSRF failure |
| Successful login with an existing active database admin | **Not possible to test: no user/admin exists. No account was invented or created.** |
| Admin authentication/authorization automated tests | 22 tests passed, 134 assertions; includes successful admin session login, non-admin write rejection, and bearer authorization, using isolated SQLite rather than the active XAMPP database |
| React production build | Passed; non-fatal dependency `use client` warnings remain |
| Postman | Not run; collection base URL updated only |

## Files changed

- `frontend/.env`: active Vite API hostname/port.
- `backend/.env`: active application URL, CORS frontend origin and Sanctum stateful origin. Database settings retained.
- `frontend/.env.example`, `backend/.env.example`: corrected templates for future setup; no credentials added.
- `frontend/src/utils/apiClient.js`: corrected fallback URL only; credential/XSRF options preserved.
- `frontend/vite.config.js`: explicit development hostname/port and strict port behavior.
- `README.md`: current local URLs/startup instructions and account-status note.
- `docs/postman/MADEBY.postman_collection.json`: base URL only; no credentials/tokens added.
- `docs/CONNECTIVITY.md`: this diagnosis, evidence, limits and login guide.
- `docs/connectivity-home-verified.png`: browser evidence of the corrected frontend URL.

No frontend design, CSS, images, gallery logic, animations, marketplace features, backend relationships or data were changed. No migration, seed, database reset or deployment was run in the active database.

## How to access Admin

There is currently no existing admin account to sign in with. If you intentionally want to create your first one:

1. From the project root, run `cd backend`.
2. Run `php artisan madeby:admin your-email@example.com --name="Your Name"` using your own new email and desired name.
3. Enter your chosen password privately at the hidden prompt (at least 12 characters). Do not send it in chat.
4. Open `http://localhost:5175/admin/login` and enter that email/password.
5. Successful login should navigate to `http://localhost:5175/admin/dashboard`. You can also open `http://localhost:5175/admin`, which redirects guests to login.
6. Keep `localhost` in the browser URL. Do not switch to 127.0.0.1 mid-session.

Marketplace: `http://localhost:5175/`. Laravel API base: `http://localhost:8001/api`.
