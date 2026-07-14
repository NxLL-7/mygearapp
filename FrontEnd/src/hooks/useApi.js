import { useState, useEffect, useRef, useCallback } from "react";
import { apiFetch } from "../utils/api";

/**
 * Custom hook for API calls with automatic cleanup.
 *
 * Features:
 * - Tracks loading / error / data state
 * - AbortController cancels requests on unmount (prevents memory leaks)
 * - Prevents state updates after unmount
 * - Integrates with TopLoader via window events
 *
 * @param {string} endpoint — e.g. "/get-gadgets"
 * @param {object} fetchOptions — { method, body, headers }
 * @param {boolean} immediate — whether to fetch on mount (default: true)
 * @returns {{ data, loading, error, refetch }}
 */
export function useApi(endpoint, fetchOptions = {}, immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const execute = useCallback(async () => {
    // Cancel any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    window.dispatchEvent(new Event("start-loading"));

    try {
      const result = await apiFetch(endpoint, {
        ...fetchOptions,
        signal: controller.signal,
      });

      // Don't update state if this request was aborted
      if (controller.signal.aborted) return;

      if (result.ok) {
        setData(result.data);
      } else {
        setError(result.data?.message || "Something went wrong.");
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(err.message);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        window.dispatchEvent(new Event("stop-loading"));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [execute, immediate]);

  return { data, loading, error, refetch: execute };
}
