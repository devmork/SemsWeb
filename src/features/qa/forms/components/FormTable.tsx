import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Form } from "../types";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface FormTableProps {
  forms: Form[];
  onEdit?: (form: Form) => void;
  onDelete?: (form: Form) => void;
  onManageContent?: (form: Form) => void;
}

export function FormTable({ forms, onEdit, onDelete, onManageContent }: FormTableProps) {
  if (forms.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium">No form templates yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create one to pair an evaluation type with a title.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full min-w-[640px] text-left">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Title
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Evaluation Type
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Created
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form) => (
            <tr
              key={form.formId}
              className="border-b border-border last:border-0 transition-colors hover:bg-muted/40"
            >
              <td className="px-4 py-3 text-sm font-medium">{form.title}</td>
              <td className="px-4 py-3 text-sm">
                {form.evaluationTypeName}
              </td>
              <td className="px-4 py-3">
                <Badge variant={form.isActive === 1 ? "default" : "outline"}>
                  {form.isActive === 1 ? "Active" : "Draft"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {new Date(form.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    aria-label={`Manage content for ${form.title}`}
                    onClick={() => onManageContent?.(form)}
                  >
                    Content
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${form.title}`}
                    onClick={() => onEdit?.(form)}
                  >
                    <IconEdit />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${form.title}`}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDelete?.(form)}
                  >
                    <IconTrash />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
