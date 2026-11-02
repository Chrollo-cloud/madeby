# Local integration verification — 2 November 2026

## Automated checks

- Laravel dependency installation completed; Breeze and Sanctum installed. Default Sail dependency removed; no Docker setup added.
- `composer validate --no-check-publish`: valid.
- `composer check-platform-reqs`: passed against installed dependencies.
- `php artisan test`: **22 passed, 134 assertions**. Tests use in-memory SQLite, separate from the local catalogue database.
- `npm run build`: passed with Vite 8.3.5. Vite reports non-fatal `use client` directive warnings from React dependencies; this application is a client-rendered SPA.
- `npm audit`: zero known vulnerabilities following the Vite 8.3.5 patch update.

API feature coverage includes original catalogue resources and relationships, slug and numeric-ID lookup, missing records, pagination, category/type/search filters, unauthenticated and non-admin write rejection, admin create/update/delete, image persistence/deletion, multipart PATCH method override, invalid media, gallery ownership validation, retaining at least one image, validation errors, listing-type switching, non-destructive seeding, Breeze session login/logout, and prevention of admin self-registration.

## Live database and browser checks

The dedicated `madeby_marketplace` database was created on local XAMPP MariaDB 10.4.28 using the `mysql` driver. Non-destructive migrations and seeders ran successfully. No existing database was reset and `migrate:fresh` was not used.

Browser verification at `http://127.0.0.1:5173` with Laravel at port 8000:

1. Original homepage, catalogue, categories, creators and gallery images loaded through the API.
2. Breeze login established a Sanctum session and opened the protected admin dashboard.
3. Duplicate slug submission displayed Laravel's 422 message inline and an error toast.
4. React created `integration-test-work`, with an uploaded original sticker image. Direct SQL confirmed its row: title `Integration Test Work`, price `55000.00`, stock `4`; its image record had `uploaded=1`.
5. React edited that item to `Integration Test Work Edited`, switched it to a commission, and showed a success toast. Direct SQL confirmed `type=commission`, `price_from=75000.00`, `commission_slots=2`, and null product price/stock.
6. The public listing-detail page displayed that new database-backed commission and uploaded image.
7. React deleted the disposable listing. Direct SQL confirmed zero rows for its slug and a restored count of 10 original listings. Its uploaded file was also absent from Storage.
8. The final accessible delete-confirmation dialog was checked, including Cancel, which preserved the original Sticker Pack.
9. Admin search, PHOTOGRAPHY category filtering, and pagination to page 2 of 2 worked against the API.
10. Sign out returned the browser to admin login.
11. With Laravel intentionally stopped, the homepage still displayed its original content and an explicit fallback banner. After restart, Retry removed the failure notice and reloaded live data.
12. API-backed Sticker Pack retained Add to cart and Save behavior; navbar counts updated. Commission detail retained five gallery images, thumbnail switching, and the request modal.
13. Desktop admin layout (1440px) and mobile listing layout (390px) were inspected. The browser's temporary viewport override was reset afterward.

Temporary test listing, uploaded file, and test admin account were removed. The final database contains 10 listings, six creators, and seven categories. Create your own admin using `php artisan madeby:admin your-email@example.com`.

## Preservation checks and limits

SHA-256 comparisons against the pre-edit backup verified **62 original asset, catalogue-data, and storefront-CSS files unchanged**. All original pages and assets remain present. The listing-card cursor-to-image selection handlers and gallery animation remain in place; thumbnail switching was exercised in the browser, while pointer scrubbing was inspected in code rather than automatically simulated.

The backup is `/private/tmp/madeby-before-api-20261102.tar.gz`; copy it to a durable location if you want long-term retention. It includes the original frontend Git metadata, source, and assets, excluding dependencies and generated build output. The Git directory was moved from `frontend/.git` to the root, preserving the original remote and history. Git will show the original root paths as removed and the `frontend/` paths as new until the restructure is staged; dependency/build paths formerly tracked in the original repository are intentionally not reintroduced under `frontend/`.

The supplied Laravel CRUD and BAB III REST API PDFs were reviewed in a follow-up. Three additional bearer-authentication tests now cover non-admin registration, hashed token storage, expiry, profile access, current-token revocation, and real bearer admin authorization. The full suite still passes, including existing Breeze cookie-session tests. The Postman collection JSON and embedded scripts were checked locally; the collection itself has not been executed in Postman. The separate React Integration BAB IV document was subsequently supplied and reviewed in full; see `BAB_IV_CHECKLIST.md` for the current audit. Cart, checkout, payment, orders, saved/follow state, creator application and commission request submission remain frontend-only prototypes. Password reset/email verification have Breeze backend scaffolding and feature tests but no additional React UI. No deployment or payment gateway was attempted.

## BAB IV follow-up audit

Only the existing three admin JSX pages changed: Search submit control, stock/slot display, field-linked Laravel validation messages and an edit-load failure toast. All CSS, storefront pages, images, cursor gallery code, API functions, contexts and backend source stayed unchanged. Full checklist: [BAB_IV_CHECKLIST.md](BAB_IV_CHECKLIST.md).

The Laravel suite was rerun (22 passed, 134 assertions), as was the React production build (passed). Browser checks were repeated against MariaDB: Search/category combination, page 2, API category/creator dropdowns, create with upload and duplicate-slug validation, populated edit, edit duplicate-slug validation, replacement image upload, confirmed delete, and missing-record retry/error toast. SQL confirmed create at 55000/stock 3 and edit at 65000 with updated title; old/replacement Storage files were removed as expected. Postman was not run. No automated React component/browser test suite is claimed.
