import { createRootRoute, Outlet, Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: () => {
    return (
      <div>
        <h1>404 — Page Not Found</h1>
        <Link to="/">Go Home</Link>
      </div>
    );
  },
});
