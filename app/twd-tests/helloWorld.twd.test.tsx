import { createRoutesStub } from "react-router";
import { twd, screenDomGlobal } from "twd-js";
import { beforeEach, describe, it } from "twd-js/runner";
import { createRoot } from "react-dom/client";
import Home from "~/routes/home";

describe("Hello World Test", () => {
  let root: ReturnType<typeof createRoot> | undefined;

  beforeEach(async () => {
    // Cleanup previous root if it exists.
    // We do this here instead of afterEach so the component stays mounted
    // after the test finishes, allowing for manual interaction.
    if (root) {
      root.unmount();
      root = undefined;
    }

    // Navigate to the empty test harness page
    await twd.visit('/test-harness');
    
    // Get the container from the harness page
    const container = await screenDomGlobal.findByTestId('test-harness');
    root = createRoot(container);
  });

  it("should render home page test", async () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: Home,
        loader() {
          return { title: "Home Page test" };
        },
      },
    ]);

    // Render the Stub
    root.render(<Stub />);
    // Check for the element within our test container
    // We scope the search to the container to be safe, or just search globally since the harness is empty otherwise
    const h1 = await screenDomGlobal.findByRole('heading', { level: 1 });
    twd.should(h1, 'have.text', 'Home Page test');
  });

  it("should render home page test 2", async () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: Home,
        loader() {
          return { title: "Home Page test 2" };
        },
      },
    ]);

    // Render the Stub
    root.render(<Stub />);
    // Check for the element within our test container
    // We scope the search to the container to be safe, or just search globally since the harness is empty otherwise
    const h1 = await screenDomGlobal.findByRole('heading', { level: 1 });
    twd.should(h1, 'have.text', 'Home Page test 2');
  });
});
