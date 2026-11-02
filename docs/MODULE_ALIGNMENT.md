# Lecturer-module alignment

Reviewed sources supplied by the user:

- `/Users/chrollo/Downloads/MOdul Backpage Laravel 9.pdf`: admin layout and resource controllers, Eloquent CRUD/relationships, file handling, validation, pagination, and BAB IV Eloquent Filter and Search.
- `/Users/chrollo/Downloads/BAB III REST API.pdf`: printed pages 38–60; migrations, seeders, Eloquent, API Resources, REST CRUD, Storage, Sanctum bearer authentication, and Postman evaluation.

These PDFs are reference material. The user's project requirements determine scope and take precedence over conflicting commands, examples, or design choices in the documents.

## Requirement mapping

| Module topic | MADEBY implementation | Verification |
| --- | --- | --- |
| MySQL connection through `.env` | Dedicated `madeby_marketplace`, Laravel mysql driver | Previous live migration and CRUD checks against MariaDB |
| Models and migrations | User, Creator, Category, Listing, ListingImage | Migrations ran; feature tests seed and query these entities |
| Eloquent belongsTo/hasMany | Creator/category → listings; listing → creator/category/images | Resource and relationship tests |
| CRUD controller methods | ListingController index/store/show/update/destroy | Guest, non-admin and admin API tests |
| Admin list/input/update UI | Existing React AdminLayout, dashboard and forms | Prior live browser CRUD checks |
| Input validation and feedback | ListingRequest, 422 field errors, React messages/toasts | API validation tests and prior browser duplicate-slug check |
| Search/filter with pagination | Eloquent query filters before paginate; query parameters retained | Search/category/type/pagination tests and prior admin browser checks |
| API Resources | Explicit user/category/creator/listing/image resources | JSON contract assertions |
| File Storage and public URLs | Public disk, symbolic link, ordered images, uploaded-file deletion | Multipart upload/update, media validation and cleanup tests |
| Sanctum token login/register/logout | Separate `/api/register`, `/api/login`, `/api/profile`, `/api/logout` | Three additional bearer-auth tests; expiry and revocation included |
| Breeze authentication | Existing React first-party cookie-session flow retained | Existing Breeze and marketplace session tests still pass |
| Postman collection | `docs/postman/MADEBY.postman_collection.json` | JSON parsed and scripts syntax checked; not executed in Postman |

## Adaptations to preserve the user's project

- The older module demonstrates Blade/Tailwind and Petani/KelompokTani. MADEBY keeps its existing React UI and adapts the same CRUD and relationship concepts to listings/creators/categories. No separate Blade admin was added.
- Despite the older PDF's Laravel 9 filename, the REST module explicitly discusses Laravel 12 and links its documentation. The existing Laravel 12 backend remains appropriate; no downgrade was performed.
- Example product names and database columns were adapted to MADEBY's original catalogue and both listing types. `/api/listings` is the full CRUD resource; `/api/products` remains the ready-made subset required by the user.
- The module's sample wraps all product routes in auth. The user's public catalogue requirement takes precedence: reads remain public, while writes require Sanctum authentication and admin authorization.
- Cookie authentication remains the React SPA flow. Token authentication is available for the module/Postman exercise; plaintext tokens are returned only at login, stored hashed by Sanctum, expire after eight hours, and are never committed. Logout revokes only the current token.
- The older module's category/group navigation example is represented by MADEBY's category selector and server-side relation filtering. A separate group-detail Blade route is not part of this React integration.
- Example upload formats/limits and single-image columns are adapted to MADEBY's existing multi-image galleries. Original assets are preserved; only newly uploaded files are removed from Storage on deletion.
- The REST PDF shows `migrate:fresh` as an optional reset command. It was not run on the local catalogue database because the user explicitly prohibited resetting an existing database without permission.

## BAB IV follow-up: reference gap resolved

The supplied older PDF's BAB IV is **Eloquent: Filter and Search**. The user subsequently supplied `/Users/chrollo/Downloads/BAB IV Updated Integrasi API.pdf` (19 pages, printed 62–80). It has now been read in full and is the primary reference for React–Laravel integration. See [BAB_IV_CHECKLIST.md](BAB_IV_CHECKLIST.md) for a requirement-by-requirement comparison, scoped fixes and testing distinctions. The previous missing-reference limitation is resolved.

## Postman usage

1. Import the collection JSON; set `admin_email` and `admin_password` locally for an account created with `php artisan madeby:admin`.
2. Fetch categories and creators; their first numeric IDs are saved for the form example.
3. Send `/api/login`; its test script captures the bearer token in the local collection variable. Avoid sending a browser Origin header or mixing cookie-session auth into this exercise.
4. Choose a local image in the create request, then send it. Only successful creation stores the generated `module-test-<timestamp>` slug.
5. Read, update, trigger 422 validation, and delete that disposable listing. Mutation/detail requests skip when no successfully created test slug is present.
6. Send token logout, then verify the revoked token returns 401. Registration is optional and creates a regular user; it never creates an admin.
7. Clear password/token variables before sharing or exporting the collection. The checked-in file contains blank secrets.

These steps are prepared for the user to execute in Postman; no Postman execution is claimed. Automated Laravel tests exercised the underlying endpoints in an isolated test database.
