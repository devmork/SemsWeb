/* eslint-disable react-hooks/rules-of-hooks */
import { createFileRoute } from "@tanstack/react-router";
import { FormEditor } from "@/features/qa/forms";

export const Route = createFileRoute("/_authenticated/qa/forms/$formId")({
  component: () => {
    const { formId } = Route.useParams();
    return <FormEditor formId={Number(formId)} />;
  },
});
