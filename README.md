# Clinic Stock Console

An internal stock management console for clinic supplies teams. The application allows staff to search, filter, sort and inspect stock items, and correct stock counts when a physical count differs from the system.

## Technology

- React + TypeScript + Vite
- React Router
- TanStack Query
- Tailwind CSS
- React Hook Form + Zod
- Native Fetch API
- Vitest + React Testing Library
- ESLint + Prettier
- GitHub Actions
- Vercel
- DummyJSON API

## Interface and Component Design

The application is divided into two main screens:

### Stock List

The stock screen is structured as:

```text
StockPage
├── Page heading and description
├── StockFilters
│   ├── Search input
│   ├── Category filter
│   └── Sort controls
├── StockList
│   └── Stock list items
└── Pagination
```

The filters are kept separate from the list so that searching, filtering and sorting can be changed without making the list responsible for all of the page controls.

The list provides a practical table/list layout that can work on both desktop screens and smaller ward tablets.

### Stock Detail

The detail screen is structured around one stock item:

```text
StockDetailPage
├── Back navigation
├── Item information
├── Share/copy link
└── StockCorrection
    └── Stock correction form
```

The detail page has its own URL:

```text
/stock/:id
```

This allows staff to open or share a direct link to a specific item.

## State Management

Different types of state are kept in different places depending on their purpose.

### Server State

Stock data, individual stock items and categories are managed using **TanStack Query**.

Examples include:

- Stock list data
- Individual item details
- Category data
- Stock correction mutations

TanStack Query provides caching, loading/error states and request lifecycle management.

After a successful stock correction, the relevant item cache is updated and the stock list is invalidated so that other views can obtain the latest data.

### URL State

Search, category, sorting, ordering and pagination are stored in the URL:

```text
/stock?search=phone&category=smartphones&sort=price&order=asc&page=1
```

The item ID is also part of the URL on the detail screen:

```text
/stock/1
```

This makes filtered views and individual items shareable and allows browser refresh/navigation without losing the current view.

### Local UI State

Temporary interaction state is kept locally in components. For example, the search input has local state while the user is typing, with a short debounce before the URL and query are updated.

This avoids putting temporary input state into global state unnecessarily.

## Data Fetching and Caching

The application uses the DummyJSON REST API as the data source.

TanStack Query manages requests using query keys based on the current stock filters. This means different searches, categories, sorting options and pages are cached separately.

Search requests use a debounce to avoid making a request for every keystroke. Requests also use the browser's `AbortSignal` so outdated requests can be cancelled when the user changes the search.

For this assessment's small mock dataset, the application retrieves the available catalogue and performs the required sorting and pagination consistently on the client.

Categories use a longer cache lifetime because they change less frequently than stock data.

A successful stock correction updates the individual item cache and invalidates the stock list so the list can reflect the change.

## Layout and Visual Design

The interface uses Tailwind CSS utility classes rather than a separate design system or custom theme.

The design prioritizes:

- Clear visual hierarchy
- Consistent spacing
- Simple borders and surfaces
- Readable typography
- Clear button states
- Responsive layouts
- Adequate touch targets for tablet use

The interface intentionally uses a restrained visual style rather than adding unnecessary decoration, since this is an internal clinic console where finding and correcting stock quickly is more important than visual complexity.

## Responsive Design

The main layout is designed to remain usable from approximately 360px wide screens through desktop layouts.

On smaller screens:

- Controls can stack rather than becoming cramped.
- The stock list remains usable without forcing the entire page to overflow.
- Buttons and form controls retain practical touch targets.
- Item details remain readable.

## Accessibility

Accessibility was considered as part of the implementation rather than as a separate feature.

The application uses:

- Semantic HTML where appropriate
- Labels for form controls
- Keyboard-accessible controls
- Visible focus states
- Disabled states for unavailable pagination actions
- `role="alert"` for important error messages
- Clear loading, empty and error states
- Validation messages for invalid stock corrections
- Information that is not communicated through colour alone

## Decision Log

### 1. URL state instead of global state for filters

**Decision:** Store search, category, sorting and pagination in the URL.

**Alternative rejected:** Store all stock filters in React/global application state.

**Why:** The URL makes the current stock view shareable and preserves the state when users refresh or navigate. This directly supports the requirement for staff to share links and makes browser navigation more useful.

### 2. TanStack Query instead of manually managing server state

**Decision:** Use TanStack Query for stock and category data.

**Alternative rejected:** Manage API data entirely with `useState` and `useEffect`.

**Why:** Stock data is server state rather than ordinary UI state. TanStack Query provides caching, loading/error states, request cancellation support and cache invalidation without requiring a custom data-fetching layer.

### 3. Client-side combination of filtering, sorting and pagination

**Decision:** Retrieve the available DummyJSON catalogue and perform the combined filtering/sorting/pagination behaviour in the application.

**Alternative rejected:** Build a separate backend or make multiple API requests to reproduce every combination of filters.

**Why:** DummyJSON is the required data source and the assessment dataset is small. A separate backend would add significant complexity without being required by the brief. The current approach also gives consistent behaviour when search, category, sorting and pagination are combined.

### 4. React Router paths for shareable stock items

**Decision:** Use `/stock/:id` for item details.

**Alternative rejected:** Open item details through temporary component state or a modal without a dedicated URL.

**Why:** Staff need to share links to specific stock items. A dedicated route also allows users to bookmark or refresh a specific item.

### 5. Vercel SPA rewrite for direct routes

**Decision:** Configure Vercel to serve `index.html` for application routes.

**Alternative rejected:** Change the detail route to avoid nested URLs.

**Why:** React Router handles `/stock/:id` in the browser, but Vercel initially returned a 404 when the route was accessed directly. The rewrite allows the client-side router to handle the route while preserving the required shareable URL.

## Known Limitation

The DummyJSON update endpoint simulates updates rather than providing persistent clinic stock storage. The application therefore updates its local/query state after a successful correction, but the mock API should not be treated as a production persistence layer.

For a real multi-clinic deployment, I would introduce a backend and persistent database, with server-side filtering, sorting and pagination and proper authorization around stock corrections.
