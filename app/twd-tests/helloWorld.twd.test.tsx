import { createRoutesStub, useLoaderData, useParams, useMatches } from "react-router";
import { twd, screenDom, userEvent } from "twd-js";
import { beforeEach, describe, it } from "twd-js/runner";
import { createRoot } from "react-dom/client";
import Home from "~/routes/home";
import { setupReactRoot } from "./utils";

describe("Hello World Test", () => {
  let root: ReturnType<typeof createRoot> | undefined;

  beforeEach(async () => {
    root = await setupReactRoot();
  });

  it("should render home page test", async () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => {
          const loaderData = useLoaderData();
          const params = useParams();
          const matches = useMatches() as any;
          return <Home loaderData={loaderData} params={params} matches={matches} />;
        },
        loader() {
          return { title: "Home Page test" };
        },
      },
    ]);

    // Render the Stub
    root!.render(<Stub />);
    // Check for the element within our test container
    // We scope the search to the container to be safe, or just search globally since the harness is empty otherwise
    const h1 = await screenDom.findByRole('heading', { level: 1 });
    twd.should(h1, 'have.text', 'Home Page test');
  });

  it("should render home page test 2", async () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => {
          const loaderData = useLoaderData() as any;
          const params = useParams();
          const matches = useMatches() as any;
          return <Home loaderData={loaderData} params={params} matches={matches} />;
        },
        loader() {
          return { title: "Home Page test 2" };
        },
      },
    ]);

    // Render the Stub
    root!.render(<Stub />);
    // Check for the element within our test container
    // We scope the search to the container to be safe, or just search globally since the harness is empty otherwise
    const h1 = await screenDom.findByRole('heading', { level: 1 });
    twd.should(h1, 'have.text', 'Home Page test 2');

    const counterButton = await screenDom.getByText("Count is 0");
    twd.should(counterButton, 'be.visible');

    await userEvent.click(counterButton);
    twd.should(counterButton, 'have.text', 'Count is 1');

    await userEvent.click(counterButton);
    twd.should(counterButton, 'have.text', 'Count is 2');

    await userEvent.click(counterButton);
    twd.should(counterButton, 'have.text', 'Count is 3');
  });
});
