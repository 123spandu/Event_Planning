import { useCallback, useEffect, useState } from 'react';

/** Small helper for admin panels: load data, expose reload + error. */
export function useAsync(fn, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await fn());
    } catch (e) {
      setError(e.message || 'Failed to load.');
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);
  return { data, setData, error, loading, reload: load };
}

export const STATUSES = ['New', 'Contacted', 'Quoted', 'Confirmed', 'Completed', 'Cancelled'];
export const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
