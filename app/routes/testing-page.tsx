// app/root.tsx
let twdInitialized = false;

export async function clientLoader() {
  if (import.meta.env.DEV) {
    const testModules = import.meta.glob("../**/*.twd.test.{ts,tsx}");
    if (!twdInitialized) {
      const { initTWD } = await import('twd-js/bundled');
      initTWD(testModules, {
        serviceWorker: false,
      });
      twdInitialized = true;
    }
    return {};
  } else {
    return {};
  }
}

export default function TestHarness() {
  return <div data-testid="testing-page" style={{ width: '100%', height: '100vh' }} />;
}
