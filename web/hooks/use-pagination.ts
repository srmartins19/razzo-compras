'use client';
import { useState, useCallback } from 'react';

export interface PaginationState {
  page:      number;
  limit:     number;
  total:     number;
  totalPages:number;
  setPage:   (p: number) => void;
  setLimit:  (l: number) => void;
  setTotal:  (t: number) => void;
  reset:     () => void;
  hasNext:   boolean;
  hasPrev:   boolean;
}

export function usePagination(initialLimit = 20): PaginationState {
  const [page,  setPage]  = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const reset      = useCallback(() => setPage(1), []);

  const handleSetLimit = useCallback((l: number) => { setLimit(l); setPage(1); }, []);

  return {
    page, limit, total, totalPages,
    setPage, setLimit: handleSetLimit, setTotal,
    reset,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
