import axios, { type AxiosError } from "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    /** set after one refresh attempt, so a request never retries forever */
    _retry?: boolean;
    /** the session check must not redirect the user; it just reports "signed out" */
    skipAuthRedirect?: boolean;
  }
}

export const API_BASE_URL = import.meta.env.VITE_API_URL as string;

const REFRESH_PATH = "/api/auth/refresh";

export const api = axios.create({
  baseURL: API_BASE_URL,
  // Sends the HttpOnly ACCESS_TOKEN and REFRESH_TOKEN cookies. No Authorization header.
  withCredentials: true,
});

/**
 * The API client stays framework- and app-agnostic: the app layer registers
 * what should happen when a session cannot be refreshed.
 */
type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler): void {
  unauthorizedHandler = handler;
}

let refreshPromise: Promise<boolean> | null = null;

/**
 * Rotates the refresh cookie. Concurrent callers share one request, because
 * two refreshes at once would look like token reuse to the backend.
 */
export function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = api
      .post(REFRESH_PATH)
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config;

    if (
      !original ||
      error.response?.status !== 401 ||
      original._retry ||
      original.url?.includes(REFRESH_PATH)
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    const refreshed = await refreshSession();
    if (!refreshed) {
      if (!original.skipAuthRedirect) {
        unauthorizedHandler?.();
      }
      return Promise.reject(error);
    }

    // The new ACCESS_TOKEN cookie is already set, so the retry needs no header changes.
    return api(original);
  },
);
