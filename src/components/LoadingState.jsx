export function LoadingState() {
  return <div className="loading-state">Loading Musina interface data...</div>;
}

export function ErrorState({ error }) {
  return (
    <div className="error-state">
      <div>
        <strong>Something did not load.</strong>
        <p>{error?.message ?? 'Please check the public/data folder and file names.'}</p>
      </div>
    </div>
  );
}
