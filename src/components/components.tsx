export const Spinner = () => <div>Loading…</div>;
export const EmptyState = ({ title = 'No results', hint }: { title?: string; hint?: string }) => (
  <div>
    <h3>{title}</h3>
    {hint && <p>{hint}</p>}
  </div>
);
export const ErrorState = ({ message }: { message: string }) => (
  <div>
    <h3>Something went wrong</h3>
    <p>{message}</p>
  </div>
);