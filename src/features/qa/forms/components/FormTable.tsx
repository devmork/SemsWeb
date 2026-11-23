import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponsiveTable } from "@/shared/components/ResponsiveTable";
import type { Form } from "../types";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface FormTableProps {
  forms: Form[];
  onEdit?: (form: Form) => void;
  onDelete?: (form: Form) => void;
  onManageContent?: (form: Form) => void;
}

export function FormTable({ forms, onEdit, onDelete, onManageContent }: FormTableProps) {
  return (
    <ResponsiveTable
      ariaLabel="Evaluation forms"
      minWidth="640px"
      items={forms}
      rowKey={(form) => form.formId}
      columns={[
        {
          header: "Title",
          primary: true,
          cell: (form) => (
            <span className="font-medium text-foreground">{form.title}</span>
          ),
        },
        {
          header: "Evaluation type",
          cell: (form) => form.evaluationTypeName,
        },
        {
          header: "Status",
          cell: (form) => (
            <Badge variant={form.isActive === 1 ? "default" : "outline"}>
              {form.isActive === 1 ? "Active" : "Draft"}
            </Badge>
          ),
        },
        {
          header: "Created",
          mobileHidden: true,
          className: "text-muted-foreground",
          cell: (form) => new Date(form.createdAt).toLocaleDateString(),
        },
      ]}
      actions={(form) => (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            aria-label={`Manage content for ${form.title}`}
            onClick={() => onManageContent?.(form)}>
            Content
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Edit ${form.title}`}
            onClick={() => onEdit?.(form)}>
            <IconEdit />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${form.title}`}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete?.(form)}>
            <IconTrash />
          </Button>
        </>
      )}
    />
  );
}
