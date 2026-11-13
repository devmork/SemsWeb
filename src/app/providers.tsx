import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setUnauthorizedHandler } from "@/shared/api/client";
import { useAuthStore } from "@/features/auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

// The session-expired behaviour is app wiring, so the API client stays
// independent from auth state and routing.
setUnauthorizedHandler(() => {
  useAuthStore.getState().clearUser();
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
});

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
