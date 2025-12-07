## Frontend Migration Plan (web → webv2)

**Goal**: Rebuild the existing `web` React app in `webv2` using Next.js (TypeScript + SCSS + pnpm + shadcn/ui) while keeping all business logic and page layouts/functionality unchanged and removing `antd`, `zustand`, and `@lobehub/ui`.

### Plan
1) **Inventory & Mapping**
   - Review current routes, layouts, shared components, styles, stores, services, and assets in `web/src`.
   - Document UI elements that rely on `antd`, `@lobehub/ui`, or `zustand` to plan replacements without changing behavior.
2) **Bootstrap Next.js App**
   - Initialize `webv2` with Next.js (TypeScript, App Router), pnpm workspace, SCSS support, ESLint/Prettier config, and absolute path aliases mirroring the current structure.
   - Add `next.config` and `tsconfig` aligned with existing compiler options; set up env handling to match current Vite usage.
3) **Design System Setup**
   - Initialize shadcn/ui; add component primitives needed to replace current `antd`/`lobehub` usage (buttons, inputs, selects, tables, dialogs, tabs, dropdowns, tooltips, notifications, etc.).
   - Establish shared SCSS variables/mixins and global styles to mirror the current visual layout.
4) **State Management Migration**
   - Replace `zustand` stores with React context/reducers/hooks while preserving the existing store APIs and behavior.
   - Ensure any middleware/persistence/effects keep the same logic and data flow.
5) **Routing & Layout Port**
   - Map React Router structure to Next App Router under `webv2/app`; recreate layouts/wrappers so page structure and layout remain identical.
   - Handle redirects, dynamic routes, and 404 equivalents consistently.
6) **Component & Page Migration**
   - Move pages/features/components/hooks/services/types/utils to Next-compatible modules.
   - Swap `antd`/`@lobehub/ui` components for shadcn/ui or lightweight custom equivalents without altering business logic or layout.
   - Convert styles to SCSS (global + modules) retaining spacing/structure and existing CSS variables where present.
7) **Assets & Static Handling**
   - Copy `public` assets and any `src/assets` used at runtime into Next’s `public`; adjust import paths as needed without functional changes.
8) **Build/Test Wiring**
   - Define pnpm scripts (`dev`, `build`, `lint`, `format`, `preview` if needed); configure ESLint/Prettier for Next + SCSS.
   - Run lint/build to validate; address migration issues while keeping behavior intact.
9) **Validation & Cleanup**
   - Remove unused dependencies/configs tied to Vite/antd/zustand/lobehub.
   - Self-verify key flows/pages against the original to ensure identical functionality and layout.
