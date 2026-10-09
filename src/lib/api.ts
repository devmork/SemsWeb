import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth.store";

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function doRefresh(): Promise<string | null> {
  try {
    const { data } = await api.post<{ token: string }>(
      "/api/auth/refresh",
      null,
      {
        withCredentials: true,
        _retry: true,
      },
    );
    useAuthStore.getState().setToken(data.token);
    return data.token;
  } catch {
    return null;
  }
}

function ensureRefresh(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

// ---------- RESPONSE: silent refresh on 401 ----------
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig | undefined;

    if (
      !original ||
      error.response?.status !== 401 ||
      original._retry ||
      original.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    original._retry = true;
    const newToken = await ensureRefresh();

    if (!newToken) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
      return Promise.reject(error);
    }

    original.headers = original.headers ?? {};
    original.headers.Authorization = `Bearer ${newToken}`;
    return api(original);
  },
);

// ---------- BOOTSTRAP: run once per app lifecycle ----------
let bootstrapPromise: Promise<void> | null = null;

export function bootstrapAuth(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      if (useAuthStore.getState().token) return;
      await ensureRefresh();
    })();
  }
  return bootstrapPromise;
}
