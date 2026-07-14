const API_URL = import.meta.env.VITE_API_URL;

/**
 * Centralized fetch wrapper for all API calls.
 * - Injects auth token automatically
 * - Applies a timeout via AbortController
 * - Returns { ok, data, status } or throws on network failure
 *
 * @param {string} endpoint  — e.g. "/get-gadgets"
 * @param {object} options   — { method, body, headers, signal, timeout }
 * @returns {Promise<{ ok: boolean, data: any, status: number }>}
 */
export async function apiFetch(endpoint, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    signal,
    timeout = 15000,
  } = options;

  const token = localStorage.getItem("token");

  const defaultHeaders = {
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  // Merge external abort signal with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // If caller provides their own signal (e.g. on unmount), forward it
  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: defaultHeaders,
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal,
    });

    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please check your connection and try again.");
    }
    throw new Error("A network error occurred. Please check your internet connection.");
  } finally {
    clearTimeout(timeoutId);
  }
}
