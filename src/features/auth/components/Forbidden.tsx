import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function Forbidden() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-heading text-2xl font-semibold">403 — Forbidden</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        You don't have permission to view this page. If you believe this is a
        mistake, contact your administrator.
      </p>
      <Button variant="outline" render={<Link to="/" />}>
        Go home
      </Button>
    </div>
  );
}
