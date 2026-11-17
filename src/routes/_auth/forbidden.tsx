import { Forbidden } from "@/shared/components/Forbidden";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/forbidden")({
  component: Forbidden,
});
