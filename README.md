# TWD React Router Showcase

This project serves as a showcase and template for testing React Router v7 applications using [TWD (Testing While Developing)](https://brikev.github.io/twd/).

It demonstrates how to effectively test route components, loaders, and actions in isolation using React Router's `createRoutesStub`.

## Features

- 🧪 **TWD Integration**: Full setup with TWD for end-to-end style testing of components.
- 🛣️ **Route Testing**: Examples of testing routes in isolation using `createRoutesStub`.
- 🔄 **Mocking**: Patterns for mocking loaders and actions.
- 🧩 **Reusable Utils**: Utility functions to streamline the testing setup.

## Getting Started

### Installation

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the development server:
    ```bash
    npm run dev
    ```

### Running Tests

To run the TWD tests:

```bash
npx twd
```

Or if you have a specific script set up in `package.json`.

## Testing Strategy

The core philosophy of testing in this project is to avoid spinning up the entire application for every test. Instead, we use `createRoutesStub` from `react-router` to create a lightweight router instance that renders only the component under test.

### Key Concepts

1.  **Test Harness (`app/routes/testing-page.tsx`)**: We use a dedicated route (`/testing`) as a blank canvas for mounting our test components. **This file is required** for the tests to run, as it initializes TWD and provides the DOM element where tests are mounted.
2.  **Route Stubs**: We define stubs for our routes, allowing us to inject mock data into loaders and spy on actions.
3.  **TWD Interaction**: We use TWD to interact with the rendered DOM, just like a user would.

### Creating a New Test

1.  **Create a `.twd.test.tsx` file** in `app/twd-tests/`.
2.  **Import the setup utility**:
    ```typescript
    import { setupReactRoot } from "./utils";
    ```
3.  **Setup the root in `beforeEach`**:
    ```typescript
    let root: ReturnType<typeof createRoot> | undefined;
    beforeEach(async () => {
      root = await setupReactRoot();
    });
    ```
4.  **Write your test using `createRoutesStub`**:
    ```tsx
    it("should render my page", async () => {
      const Stub = createRoutesStub([
        {
          path: "/",
          Component: MyPage,
          loader() {
            return { someData: "mocked" };
          },
        },
      ]);
      
      root!.render(<Stub />);
      // Use TWD to assert
      await twd.should(screenDom.getByText("mocked"), "be.visible");
    });
    ```

## Project Structure

- `app/routes/`: Your application routes.
- `app/twd-tests/`: TWD test files.
  - `utils.ts`: Contains the `setupReactRoot` helper.
  - `helloWorld.twd.test.tsx`: Basic example.
  - `todoList.twd.test.tsx`: Advanced example with loaders and actions.
- `app/routes/testing-page.tsx`: The empty harness page used for mounting tests.

## Setup in Your Own Project

To add this setup to your own React Router project:

1.  **Install TWD**: Follow the [official documentation](https://brikev.github.io/twd/).
2.  **Create the Harness Route**: Add a route (e.g., `app/routes/testing-page.tsx`) that renders a simple container with a `data-testid`.
3.  **Add the Utils**: Copy `app/twd-tests/utils.ts` to your project. This handles the mounting/unmounting logic.
4.  **Start Testing**: Create your test files and start writing tests!
