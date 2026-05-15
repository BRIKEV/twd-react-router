export default function TestPage() {
  return (
    <div data-testid="testing-page" style={{ width: '100%', height: '100vh', padding: '20px' }}>
      <h1 style={{ opacity: 0.5, fontFamily: 'system-ui, sans-serif' }}>TWD Test Page</h1>
      <p style={{ opacity: 0.5, fontFamily: 'system-ui, sans-serif' }}>
        This page is used as a mounting point for TWD tests.
      </p>
    </div>
  );
}
