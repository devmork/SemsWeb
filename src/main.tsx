import "./index.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setUnauthorizedHandler } from "@/shared/api/client";
import { useAuthStore } from "@/features/auth";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree, context: { auth: undefined! } });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

// The API client stays framework- and app-agnostic; session-expiry behaviour is
// wired here at the entry point.
setUnauthorizedHandler(() => {
  useAuthStore.getState().clearUser();
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
});

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  );
}
