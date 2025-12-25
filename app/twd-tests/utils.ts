import { createRoot } from "react-dom/client";
import { twd, screenDomGlobal } from "twd-js";

let root: ReturnType<typeof createRoot> | undefined;

export async function setupReactRoot() {
  if (root) {
    root.unmount();
    root = undefined;
  }

  // Navigate to the empty test page
  await twd.visit('/testing');
  
  // Get the container from the test page
  const container = await screenDomGlobal.findByTestId('testing-page');
  root = createRoot(container);
  return root;
}
