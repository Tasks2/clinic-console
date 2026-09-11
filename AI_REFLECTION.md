## AI Reflection

### 1. How I used AI across the four sections

**Design**

I used AI to help break down the brief into components, state responsibilities and technical decisions before implementation. We discussed the difference between server state, URL state and local UI state, as well as caching, invalidation, accessibility and responsive layout. I used these discussions to create the initial architecture and decision log rather than starting directly with code.

**Build**

AI was used as a development and debugging assistant throughout implementation. I used it to reason through React Router, TanStack Query, authentication, debounced search, request cancellation, pagination, stock correction and form validation. I implemented the changes locally and verified them using manual testing, linting, tests and production builds rather than accepting generated code without checking it.

**Deploy**

I used AI to help prepare the GitHub Actions CI workflow and troubleshoot deployment issues. One important issue was direct navigation to `/stock/:id` on Vercel returning a 404. We identified this as a client-side routing/deployment issue and added a Vercel rewrite so React Router could handle the route.

**AI Reflection**

I used AI to review the development process, identify the important technical decisions and organize the reflection around the actual work completed. I also used it to challenge some of my decisions and identify areas that would need a different approach in a larger production system.

### 2. Tools and workflow

The main AI tool I used was ChatGPT. I did not use a formal spec-driven agent framework such as Superpowers, GSD, Spec Kit, OpenSpec or BMAD.

Instead, I used an incremental workflow. I first discussed the requirements and architecture, then implemented the project in small sections. After each section I ran the application, tested the relevant behaviour and used linting, automated tests and builds to validate the changes. I also committed working checkpoints to Git and used GitHub Actions and Vercel for CI and deployment validation.

AI was therefore used as an engineering assistant, while I remained responsible for deciding what to implement, testing the result and accepting or rejecting suggestions.

### 3. An AI suggestion that improved the work

One useful improvement was identifying that relying on the default number of products returned by DummyJSON could interfere with the application's local sorting and pagination. I changed the stock API calls to request the full mock catalogue using `limit=0`, then applied the application's sorting and pagination consistently.

This made the behaviour of combined search, category filtering, sorting and pagination more predictable for the assessment dataset.

### 4. An example where AI output was wrong or incomplete

One example was the handling of DummyJSON's category endpoints. The initial implementation used the category-list endpoint and assumed it was the appropriate source for the category data. I checked the actual API documentation and found that `/products/categories` returns category objects, while `/products/category-list` returns category slugs.

I changed the implementation to use `/products/categories` and map the returned objects to the slugs needed by the application.

The Vercel deployment also exposed an issue that was not visible during local development: directly refreshing `/stock/:id` returned a 404. Testing the deployed application caught this, and I added a Vercel SPA rewrite so the client-side router could handle the route.

### 5. Two decisions I made without AI

**Keeping the application domain as "stock".**
Although DummyJSON calls the records products, I kept the application's routes and components focused on the clinic domain, such as `/stock`, `StockPage`, `StockList` and `StockCorrection`. I considered this clearer for the users described in the brief.

**Keeping the solution focused on the provided API.**
I did not introduce an additional backend, database or state-management system because the assessment already provided DummyJSON as the data source. Adding more infrastructure would have increased complexity without solving a requirement in the brief.

### 6. Part of the codebase I would struggle to defend

The stock API layer is the part I would find hardest to defend for a larger production system. The current implementation retrieves the complete mock catalogue and performs some filtering, sorting and pagination on the client.

This is reasonable for the small DummyJSON dataset and the assessment, but I would not use the same approach for a real multi-clinic system with a large inventory. I would move more of the filtering, sorting and pagination to the backend and use server-side pagination to reduce network usage and improve performance over patchy connections.
