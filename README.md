# MADEBY — React marketplace + Laravel REST API

The original MADEBY storefront is preserved in `frontend/`. Laravel in `backend/` stores the actual catalogue (10 listings, six creators, seven categories) and provides protected admin CRUD. Cart, saved works, checkout, mock payment, orders, following, Become a Creator, and commission requests remain frontend prototypes. No real payment or external commission submission occurs.

## Structure and architecture

```text
e-commerce/
  frontend/                 Existing React/Vite application, original assets and CSS
    src/context/            Marketplace, catalogue adapter, Sanctum session
    src/utils/              Axios client and ProductContext/React Query hooks
    src/pages/admin/        Login, dashboard, create and edit forms
  backend/                  Laravel API-only application (MVC + Eloquent)
    app/Models/             User, Creator, Category, Listing, ListingImage
    app/Http/Controllers/   REST controllers and Breeze authentication controllers
    app/Http/Requests/      Listing validation and Breeze login validation
    app/Http/Resources/     Explicit JSON response contracts
    app/Policies/           Server-side admin authorization
    database/               Migrations and original-catalogue seed snapshot
    routes/api.php          Catalogue and protected CRUD endpoints
    routes/auth.php         Breeze authentication routes
    tests/Feature/          API, CRUD, authorization and auth tests
  docs/                     Verification results and change inventory
  README.md
  .gitignore
```

A creator and a category each have many listings; a listing belongs to both and has many ordered images. Creators optionally belong to a user. `users.is_admin` defaults to false and cannot be assigned through registration. Only authorized admins can mutate listings.

`ProductProvider` uses Axios and React Query for collections, detail queries, mutations, and cache invalidation. `CatalogueProvider` adapts the result to the original storefront contract. It keeps the homepage visible while loading and provides an explicit original-catalogue fallback per request on failure. Admin CRUD never falls back to demo rows. `MarketplaceProvider` retains the original commerce state.

## Requirements

- PHP 8.4+ recommended for the committed dependency lock; Laravel 12 itself supports PHP 8.2+, but some locked dependencies require PHP 8.4. Required extensions include PDO MySQL, PDO SQLite (tests), mbstring, XML/DOM, fileinfo, curl, OpenSSL, and GD for image tests.
- Composer 2.x (tested: 2.10.3).
- Node.js 22.12+ or a newer compatible LTS; npm 10+ (tested with Node 26 and npm 11).
- MySQL 8+ recommended, or compatible MariaDB (tested: local XAMPP MariaDB 10.4.28 using Laravel's `mysql` driver).

Run `composer check-platform-reqs` to verify the actual PHP installation against the lock file.

## Install and configure

From the project root:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Edit `backend/.env` for your local database. The example uses placeholder credentials; do not commit `.env`, `APP_KEY`, passwords, session files, or authentication tokens.

```dotenv
APP_URL=http://localhost:8001
FRONTEND_URL=http://localhost:5175
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=madeby_marketplace
DB_USERNAME=your_mysql_user
DB_PASSWORD=your_local_password
SANCTUM_STATEFUL_DOMAINS=localhost:5175
SESSION_DRIVER=file
SESSION_DOMAIN=null
FILESYSTEM_DISK=public
```

Create the dedicated database with your MySQL administration tool, or run:

```sql
CREATE DATABASE madeby_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then, from `backend/`:

```bash
php artisan migrate --seed
php artisan storage:link
php artisan madeby:admin your-email@example.com
```

The admin command securely prompts for a password of at least 12 characters. Re-running it updates that email's admin account; use your own email and password. There is no committed/default admin password. Catalogue seeding uses `firstOrCreate`, preserves edits to existing records, and creates gallery rows only for newly seeded listings. Re-running it can restore an original listing that was deleted; it is an installation seed, not a recurring synchronization job. Do not use `migrate:fresh` on an existing database.

Install the frontend:

```bash
cd ../frontend
npm ci
cp .env.example .env
```

`frontend/.env` contains:

```dotenv
VITE_API_BASE_URL=http://localhost:8001/api
```

This variable must include `/api`. Vite environment changes require restarting Vite. Use `localhost` consistently for frontend and backend browser URLs; switching between `localhost` and `127.0.0.1` breaks the shared-host cookie/XSRF flow. Laravel can remain bound to `127.0.0.1:8001`; access it as `http://localhost:8001` from the browser. Database `DB_HOST=127.0.0.1` is a separate TCP connection to XAMPP and remains unchanged. For a different frontend origin, update both `FRONTEND_URL` and `SANCTUM_STATEFUL_DOMAINS` and run `php artisan config:clear`.

## Start locally

In one terminal:

```bash
cd backend
php artisan serve --host=127.0.0.1 --port=8001
```

In another terminal:

```bash
cd frontend
npm run dev -- --host localhost --port 5175 --strictPort
```

Open [MADEBY](http://localhost:5175) or [Admin login](http://localhost:5175/admin/login). Run Git commands from the single project root; the original frontend Git history and remote were preserved there. Source and assets now live under `frontend/`. Dependencies, builds, database files, uploaded images, and local environments are ignored.

## Authentication

Breeze's API scaffold supplies session login, registration, logout, password-reset, and email-verification controllers. Sanctum authenticates the first-party React SPA using an HttpOnly session cookie. Axios sends credentials and the XSRF header; React obtains `/sanctum/csrf-cookie` before posting `/login`. No bearer token is required for this SPA and none is hardcoded or saved in browser storage. For the BAB III token-authentication exercise, separate `/api/register`, `/api/login`, `/api/profile`, and `/api/logout` endpoints are available. `/api/login` returns a Sanctum bearer token that expires after eight hours. Send it as `Authorization: Bearer <token>` when using Postman. `/api/logout` revokes the current bearer token only; the browser SPA continues using Breeze `/login` and `/logout`. Both flows enforce the same admin-only listing policy. Registration cannot grant admin access; token login/register are limited to six requests per minute per client IP. Store credentials and tokens only in local Postman variables and do not export populated secrets.

`GET /api/user` returns a `UserResource`; the React admin guard checks `is_admin`. Backend policy and request authorization enforce that role independently of the UI. Public registration creates regular users, never admins. The additional Breeze password-reset/verification routes are scaffolded and feature tested, but have no React screens; mail is logged locally by default.

## API contract

All requests should accept `application/json`. Successful single resources use `{ "data": ... }`. Listing collections add Laravel `links` and `meta` pagination fields. Collection filters are validated; `per_page` is between 1 and 100.

| Method | Endpoint | Behavior |
| --- | --- | --- |
| GET | `/api/listings` | Paginated catalogue |
| GET | `/api/listings/{listing}` | Listing by slug or numeric database ID |
| GET | `/api/products` | Ready-made products only |
| GET | `/api/commissions` | Commissions only |
| GET | `/api/categories` | All categories |
| GET | `/api/creators` | All creators, with actual listing counts |
| GET | `/api/creators/{creator}` | Creator by slug or numeric database ID |
| GET | `/api/user` | Current authenticated user |
| POST | `/api/listings` | Admin-only create; returns 201 |
| PUT/PATCH | `/api/listings/{listing}` | Admin-only update; returns 200 |
| DELETE | `/api/listings/{listing}` | Admin-only delete; returns 204 |
| POST | `/login`, `/logout` | Breeze session authentication for React |
| POST | `/api/register` | Register a regular user; returns 201 |
| POST | `/api/login` | Issue an expiring Sanctum bearer token |
| GET | `/api/profile` | Authenticated profile |
| POST | `/api/logout` | Revoke the current bearer token |

Examples:

```bash
curl -H 'Accept: application/json' 'http://localhost:8001/api/listings?search=poster&category=DESIGN&type=commission&per_page=6&page=1'
curl -H 'Accept: application/json' http://localhost:8001/api/categories
curl -H 'Accept: application/json' http://localhost:8001/api/creators
```

The resource's `id` is the original stable slug, while `databaseId` is numeric. `creatorId` is the creator slug; `creator_id` and `category_id` are numeric database keys for forms. Ready-made items use `type=product`, `price`, and `stock`; commissions use `type=commission`, `priceFrom`, and `commissionSlots`. API writes use snake case (`price_from`, `commission_slots`, `delivery_time`). Switching type clears the fields for the previous type. Numeric stock/slots cannot be negative; applicable price/stock/slots cannot be null.

Create/update fields: `slug`, `title`, `type`, `creator_id`, `category_id`, `description`, applicable price and quantity fields, optional `delivery_time`, `rating` (0–5), and `tags[]`. Slugs start with a lowercase letter and contain lowercase letters, numbers, or hyphens. POST requires at least one image. Upload `images[]` as multipart files (JPEG/PNG/WebP, up to 5 MB each; gallery max 10). PATCH may retain existing gallery images and append new ones. Send `remove_image_ids[]` to remove selected gallery records; each must belong to that listing and at least one image must remain. The React edit form uses multipart POST with `_method=PATCH` so PHP parses uploaded files correctly.

Original gallery files remain in `frontend/public/images/`; their `/images/...` URLs resolve on the frontend. New uploads use Laravel's public disk, with absolute `/storage/...` URLs based on `APP_URL`. Storage deletion removes only uploaded files; original frontend assets are never deleted. `gallery` exposes image IDs for edit/removal; `images` remains an ordered array of URLs for the original cursor preview.

Errors: 401 for guests, 403 for unauthorized users, 404 for missing records, and 422 with `message` and field-keyed `errors` for validation failures. React displays validation details inline and success/error toasts.

## Test CRUD locally

1. Sign in at `/admin/login` with the account created by `madeby:admin`.
2. Add a listing, select database category/creator, provide the applicable product or commission fields, and upload an image.
3. Confirm the success toast and dashboard result. Search for the new title; inspect it in the storefront.
4. Verify it in MySQL: `SELECT * FROM listings WHERE slug='your-test-slug';`.
5. Edit title/price or switch listing type; confirm the values in MySQL and in the storefront.
6. Trigger duplicate-slug or invalid-field validation; confirm the 422 message and toast.
7. Delete the test listing using the confirmation dialog, then verify the row and uploaded file are gone.
8. Check category/type filtering, search and Next/Previous pagination. Sign out and verify protected routes redirect to login; direct unauthenticated writes must return 401.

Automated checks:

```bash
cd backend
php artisan test
composer check-platform-reqs
cd ../frontend
npm run build
npm audit
```

Feature tests use a separate in-memory SQLite database configured in `phpunit.xml` and do not reset the local MySQL database. Live React CRUD was also checked against MariaDB. See [verification details](docs/TESTING.md) and [file-by-file changes](docs/CHANGES.md).

The supplied Laravel CRUD and BAB III REST API modules have now been reviewed. See [module alignment](docs/MODULE_ALIGNMENT.md) for requirements, adaptations, and gaps. The newly supplied BAB IV React Integration module has also been read in full and is the primary React–Laravel reference. See the [BAB IV requirement checklist](docs/BAB_IV_CHECKLIST.md) for actual file paths, fixes and separate code/API/browser/Postman evidence. Import [the Postman collection](docs/postman/MADEBY.postman_collection.json), set credentials locally, fetch categories/creators, sign in, and choose a local image before the create request. CRUD requests target only the disposable listing captured after a successful create; they skip when that slug is missing. The collection was structurally checked and its scripts syntax checked, but it has not been run in the Postman application. Authentication follows [Laravel Sanctum SPA guidance](https://laravel.com/docs/12.x/sanctum); cache handling follows [TanStack Query mutation guidance](https://tanstack.com/query/latest/docs/framework/react/guides/mutations).

Current local connectivity diagnosis and account status: [CONNECTIVITY.md](docs/CONNECTIVITY.md). The active XAMPP database had no users/admins at the time of that inspection; no account was created or modified.
