# TWD Project Patterns

## Project Configuration

- **Framework**: React + React Router v7 (framework mode, SSR)
- **Vite base path**: /
- **Dev server port**: 5173
- **App URL**: http://localhost:5173/testing
- **Dev command**: npm run serve:dev
- **Default branch**: main
- **Entry point**: app/root.tsx (loads `virtual:twd/init` in DEV; there is no index.html)
- **Public folder**: public/
- **Closing run**: full suite

`/testing` is not a base path: it is an empty route (`app/routes/testing-page.tsx`)
that tests mount components into. twd-cli opens it because it is the `url` in
`twd.config.json`.

### Runner Commands

twd-cli drives its own headless browser — only the dev server has to be up (`npm run serve:dev`).

```bash
# Run all tests
npm run test:ci

# Run specific tests by name (matches "suite > test", case-insensitive; repeatable)
npx twd-cli run --test "should render the list"
npx twd-cli run --test "should create" --test "should show the error"

# Only the tests this branch added or changed
npx twd-cli run --changed-since origin/main

# Record a run to video (one clip per matched test, needs ffmpeg)
npx twd-cli run --record --test "should render the list"
```

Every run writes `.twd/report/`: `run.json` (the result), `summary.md` and `index.html`. The folder is replaced on each run.

## Standard Imports

```typescript
import { twd, userEvent, screenDom, expect } from "twd-js";
import { describe, it, beforeEach } from "twd-js/runner";
import { createRoot } from "react-dom/client";
import { createRoutesStub, useLoaderData, useParams, useMatches } from "react-router";
import { setupReactRoot } from "./utils";
```

## Rendering Pattern

Tests do not `twd.visit()` real routes. `setupReactRoot()` (`app/twd-tests/utils.ts`)
visits `/testing`, unmounts the previous root and creates a fresh React root in
the `testing-page` container. Each test then renders the route component through
`createRoutesStub`, with the loader returning mock data directly:

```typescript
const Stub = createRoutesStub([
  {
    path: "/",
    Component: () => {
      const loaderData = useLoaderData();
      const params = useParams();
      const matches = useMatches() as any;
      return <TodoListPage loaderData={loaderData} params={params} matches={matches} />;
    },
    loader() {
      return { todos: todoListMock };
    },
  },
]);
root!.render(<Stub />);
```

## Standard beforeEach

```typescript
let root: ReturnType<typeof createRoot> | undefined;

beforeEach(async () => {
  root = await setupReactRoot();
});
```

## API Service Types

Service/API types are located in: `app/api/`

Read files in this folder to understand endpoint URLs and response shapes when writing mock data.

## CSS / Component Library

- **Library**: shadcn/ui (Radix UI + Tailwind)
- **Docs**: https://ui.shadcn.com/docs

When writing tests, refer to library docs for correct ARIA roles and component structure.

## Portals and Dialogs

Use `screenDomGlobal` instead of `screenDom` for elements rendered in portals (modals, dropdowns, tooltips):

```typescript
import { screenDomGlobal } from "twd-js";
const modal = screenDomGlobal.getByRole("dialog");
```
