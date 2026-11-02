# BAB IV React–Laravel integration audit

Primary reference: `/Users/chrollo/Downloads/BAB IV Updated Integrasi API.pdf`, read in full (19 PDF pages, printed pages 62–80), including sections 4.3.1–4.3.4 and evaluation 4.4. Audit date: 2 November 2026.

The lecturer's requirements were adapted to MADEBY listings. The PDF's product names, Tailwind UI, hardcoded example token, and exact example paths are not instructions to replace the original application. No duplicate context, page, or API service was introduced.

Evidence labels:

- **Code**: inspected the actual implementation; package presence and build do not independently prove browser behavior.
- **Automated API**: Laravel feature tests in an isolated in-memory SQLite database.
- **Browser + DB**: exercised React in the in-app browser against local Laravel and MariaDB, with direct SQL/storage checks where stated.
- **Build**: React production compilation. There is no automated React component-test suite; browser checks below are agent-driven checks, not a saved automated browser test.
- **Postman**: collection prepared earlier; not executed in Postman during this audit or the prior integration work.

## 4.3.1 — Preparation, Axios, React Query, Toaster

| Checked | Requirement | Actual file(s) | Evidence/result |
| --- | --- | --- | --- |
| [x] | Axios, React Query and React Hot Toast installed | [package.json](/Users/chrollo/Documents/e-commerce/frontend/package.json), [package-lock.json](/Users/chrollo/Documents/e-commerce/frontend/package-lock.json) | Code: installed dependencies and imports checked. Build passed. |
| [x] | Shared Axios client targets Laravel API | [apiClient.js](/Users/chrollo/Documents/e-commerce/frontend/src/utils/apiClient.js) | Code: `VITE_API_BASE_URL`, JSON Accept header; live browser CRUD reached Laravel. |
| [x] | Authentication accompanies protected calls | [apiClient.js](/Users/chrollo/Documents/e-commerce/frontend/src/utils/apiClient.js), [AuthContext.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/context/AuthContext.jsx), [api.php](/Users/chrollo/Documents/e-commerce/backend/routes/api.php) | Browser: Breeze login and protected CRUD worked. Axios sends credentials and XSRF headers for Sanctum cookies; no hardcoded token. Automated API: bearer flow also passes separately. |
| [x] | QueryClient and QueryClientProvider configured | [main.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/main.jsx) | Code: one stable QueryClient, wrapping query consumers. Build and browser rendering passed. |
| [x] | Toaster configured without removing existing providers | [main.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/main.jsx) | Code: Toaster top-right; MarketplaceProvider, CatalogueProvider, AuthProvider and ProductProvider remain. Browser: create, validation, delete and edit-load notifications observed. |
| [x] | Correct multipart handling | [ProductContext.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/utils/ProductContext.jsx), [ProductForm.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/pages/admin/ProductForm.jsx) | Code: FormData; Axios/browser sets multipart boundary, rather than forcing JSON. Browser + DB: create upload and edit replacement persisted. Automated API multipart test passed. |

## 4.3.2 — Context, routing, admin CRUD and forms

| Checked | Requirement | Actual file(s) | Evidence/result |
| --- | --- | --- | --- |
| [x] | Context Provider and useContext hook share API state/actions | [ProductContext.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/utils/ProductContext.jsx) | Code: one ProductContext, ProductProvider and useProducts hook; existing implementation reused. |
| [x] | Read all listings using useQuery | [ProductContext.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/utils/ProductContext.jsx), [catalogue.js](/Users/chrollo/Documents/e-commerce/frontend/src/services/catalogue.js) | Code: all-page collection query and independent filtered-page query. Browser dashboard data loaded; automated collection assertions passed. |
| [x] | Fetch selected listing details | [ProductContext.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/utils/ProductContext.jsx), [ProductEdit.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/pages/admin/ProductEdit.jsx) | Code: useListing query uses route parameter. Browser: edit form populated with created row, category, creator, price, stock and gallery. Automated slug/numeric lookup passed. |
| [x] | Create listing through API | [ProductContext.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/utils/ProductContext.jsx), [ProductForm.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/pages/admin/ProductForm.jsx) | Browser + DB: `bab-iv-verification-work` created at price 55000, stock 3, with an uploaded image; 201 API feature test passed. |
| [x] | Update listing through API | [ProductEdit.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/pages/admin/ProductEdit.jsx), [ProductForm.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/pages/admin/ProductForm.jsx), [ProductContext.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/utils/ProductContext.jsx) | Browser + DB: title changed to `BAB IV Verification Work Edited`, price to 65000, image replaced. Multipart POST uses `_method=PATCH`; automated update test passed. |
| [x] | Delete with confirmation and feedback | [AdminDashboard.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/pages/admin/AdminDashboard.jsx), [ProductContext.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/utils/ProductContext.jsx) | Browser: explicit dialog and Confirm delete, success toast, row disappeared. DB: disposable row removed. Both uploaded files absent after replacement/deletion. Automated delete/cleanup passed. |
| [x] | useMutation, useQueryClient and cache invalidation | [ProductContext.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/utils/ProductContext.jsx) | Code: create/update/delete mutations invalidate listing and creator query families. Browser: dashboard counts and searched row updated after mutations. |
| [x] | Existing AdminLayout and routes reused | [App.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/App.jsx), [AdminLayout.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/layouts/AdminLayout.jsx) | Code: existing `/admin/dashboard`, `/admin/listings/new`, `/admin/listings/:id/edit`; browser navigation passed. |
| [x] | Dashboard displays image/title/category/price/stock and actions | [AdminDashboard.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/pages/admin/AdminDashboard.jsx) | Fixed missing quantity display: ready-made stock or commission slots now shown. Browser observed both quantities and CRUD controls. Existing layout/CSS retained. |
| [x] | Show query loading and errors | [AdminDashboard.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/pages/admin/AdminDashboard.jsx), [ProductEdit.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/pages/admin/ProductEdit.jsx) | Code: loading, error and Retry branches. Browser: missing-record edit showed loading, inline failure, Retry and error toast. |
| [x] | Create/edit forms display server-side field errors | [ProductForm.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/pages/admin/ProductForm.jsx) | Fixed: field errors now sit by the corresponding control, with aria-invalid/describedby; nested image errors are grouped under the upload control. Browser: duplicate slug rejected on both create/edit; `error-slug` linked to the input. Automated API: 422 validation cases passed. |
| [x] | Success/error notifications and navigation after save | [ProductContext.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/utils/ProductContext.jsx), [ProductForm.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/pages/admin/ProductForm.jsx), [ProductEdit.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/pages/admin/ProductEdit.jsx) | Code: shared mutation success/error toasts; successful save navigates to dashboard. Browser: create success, edit validation error, delete success and newly added edit-load failure toast observed; create/edit navigation passed. Update-success toast is wired through the same inspected mutation handler but was not separately captured in this audit. |
| [x] | Edit displays current image and permits a new upload | [ProductForm.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/pages/admin/ProductForm.jsx) | Browser: current gallery preview, replacement upload and old-image removal worked; DB/storage confirmed replacement. |
| [x] | Both MADEBY listing types supported | [ProductForm.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/pages/admin/ProductForm.jsx), [ListingRequest.php](/Users/chrollo/Documents/e-commerce/backend/app/Http/Requests/ListingRequest.php) | Code: product price/stock vs commission starting price/slots. Automated API: type switching and relevant field validation pass. This audit's live CRUD used a ready-made listing; commission live workflow was tested during the earlier integration, not repeated here. |

## 4.3.3 — Categories and relationships

| Checked | Requirement | Actual file(s) | Evidence/result |
| --- | --- | --- | --- |
| [x] | GET categories from Laravel | [ProductContext.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/utils/ProductContext.jsx), [CatalogueController.php](/Users/chrollo/Documents/e-commerce/backend/app/Http/Controllers/CatalogueController.php) | Code: existing categories useQuery calls shared collection loader for `/categories`. Automated API returns seven original categories. |
| [x] | Category dropdown in create and edit, using database IDs | [ProductForm.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/pages/admin/ProductForm.jsx) | Browser: seven API categories available, ART selected on create and restored on edit. Shared form avoids duplicated category functions. |
| [x] | Current category selected on edit, server validates relationship | [ProductForm.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/pages/admin/ProductForm.jsx), [ListingRequest.php](/Users/chrollo/Documents/e-commerce/backend/app/Http/Requests/ListingRequest.php) | Code: selected `category_id` initialized from resource; exists validation. Browser: ART retained. Automated API tests passed. |
| [x] | MADEBY creator selection uses related database data | [ProductContext.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/utils/ProductContext.jsx), [ProductForm.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/pages/admin/ProductForm.jsx) | Browser: Pim selected/restored; numeric creator ID submitted. Existing relationships unchanged. |

## 4.3.4 — Pagination and filter

| Checked | Requirement | Actual file(s) | Evidence/result |
| --- | --- | --- | --- |
| [x] | Backend accepts search, category and page-size/page parameters | [ListingController.php](/Users/chrollo/Documents/e-commerce/backend/app/Http/Controllers/ListingController.php) | Code: retained `/api/listings?page=1&per_page=6&category=DESIGN&search=poster`; filters are applied before paginate and links preserve parameters. Automated API filters/pagination passed. |
| [x] | Parameterized client query retains pagination metadata | [ProductContext.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/utils/ProductContext.jsx) | Code: useListings sends Axios params and returns full body including Laravel meta/links. Query key includes filters/page. Existing function reused. |
| [x] | Search input, API category selector and explicit Search button | [AdminDashboard.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/pages/admin/AdminDashboard.jsx) | Fixed missing Search button. Submitted keyword is separate from draft text; category/type changes reset page. Browser: `poster` plus DESIGN returned the matching two records. |
| [x] | Previous/Next and active page display | [AdminDashboard.jsx](/Users/chrollo/Documents/e-commerce/frontend/src/pages/admin/AdminDashboard.jsx) | Browser: page 2 of 2 displayed remaining original records; empty/last-page next button disabled. Automated API metadata assertions passed. |

## Deliberate adaptations from the example

- `products` → `listings`; `name` → `title`; single `img` → ordered `images[]` and gallery records. Existing `/api/products` remains the ready-made subset.
- Module `limit` → existing `per_page`; `keyword` → existing `search`; `category_id` list filter → existing category name/slug filter. Form writes still use numeric `category_id`. Backend endpoints/relationships were not changed.
- The module's example hardcoded bearer token was not copied. Existing first-party React authentication correctly uses Sanctum cookies/XSRF through Breeze. Separate token endpoints remain available for the earlier BAB III/Postman exercise.
- Axios infers Content-Type for JSON and FormData; manually fixing a multipart header can omit the required boundary. Query invalidation uses installed React Query v5's object form.
- One shared ProductForm handles create/edit. useListing/useListings remain beside the provider rather than adding redundant getProductById/getProducts wrappers. Existing categories useQuery replaces a duplicate getCategories wrapper.
- Save redirects immediately while the globally mounted Toaster remains visible; the module's arbitrary delay is unnecessary for the required behavior.
- Existing MADEBY CSS/classes are reused. No Tailwind redesign, new icon system, storefront edits, catalogue replacement or duplicate admin pages were made.

## Final verification and preservation

- **Automated API:** `php artisan test` → 22 passed, 134 assertions, SQLite in memory. This validates backend behavior; it is not a React browser test.
- **Build:** `npm run build` from `frontend/` passed. Non-fatal upstream `use client` bundler warnings remain; no build error.
- **Browser + MariaDB:** session login, Read/Create/Update/Delete, category/creator dropdowns, create/edit duplicate-slug errors, upload/replacement, Search, combined filtering, pagination, delete toast and edit-load error toast checked in this audit. Test data was disposable; original catalogue retained.
- **Postman:** not run. Existing collection preparation is separate evidence, not a completed Postman test.
- **Scope hashes:** compared before/after source/assets. Only `AdminDashboard.jsx`, `ProductForm.jsx`, `ProductEdit.jsx` changed under application source. All CSS, images, cursor-gallery code, original marketplace pages, contexts/API functions, backend routes and database relationships are byte-for-byte unchanged in this audit. Documentation and this verification screenshot were also updated/added.
- Temporary listing, both uploaded test images and temporary test admin removed. Final original counts: 10 listings, six creators, seven categories. No database reset, migration change, Docker or deployment work performed.

The implementation checklist supports the module's 4.4 learning outcomes (Axios, Context, CRUD, search/pagination). It does not claim to assess the student's personal understanding.
