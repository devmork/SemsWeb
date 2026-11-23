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
const ACCESS_TOKEN_KEY = "sems.accessToken";
const REFRESH_TOKEN_KEY = "sems.refreshToken";

export type StoredTokens = { accessToken: string; refreshToken: string };

/**
 * Bearer-token storage.
 *
 * Documented deviation: the API no longer issues cookies (cross-site cookies are
 * blocked by Safari/Firefox), so tokens live in localStorage and are attached to
 * every request as `Authorization: Bearer`. This is XSS-exposed; it is mitigated
 * by the CSP in vercel.json and by short access-token lifetimes. See
 * "Option 3 - Bearer Tokens - Revised Plan.md" §7.
 */
export const tokenStore = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  set(tokens: StoredTokens): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  },
  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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

type TokenPayload = {
  accessToken: string;
  refreshToken: string;
};

let refreshPromise: Promise<boolean> | null = null;

/**
 * Rotates the refresh token. Concurrent callers share one request, because
 * two refreshes at once would look like token reuse to the backend.
 */
export function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    const refreshToken = tokenStore.getRefreshToken();
    if (!refreshToken) return Promise.resolve(false);

    refreshPromise = api
      .post<TokenPayload>(REFRESH_PATH, { refreshToken }, { skipAuthRedirect: true })
      .then(({ data }) => {
        tokenStore.set({ accessToken: data.accessToken, refreshToken: data.refreshToken });
        return true;
      })
      .catch(() => {
        tokenStore.clear();
        return false;
      })
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

    // The request interceptor re-attaches the freshly stored access token.
    return api(original);
  },
);
