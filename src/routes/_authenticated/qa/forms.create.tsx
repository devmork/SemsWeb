import { createFileRoute } from "@tanstack/react-router";
import { FormEditor } from "@/features/qa/forms";

export const Route = createFileRoute("/_authenticated/qa/forms/create")({
  component: () => <FormEditor />,
});
