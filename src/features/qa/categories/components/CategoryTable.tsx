import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ResponsiveTable } from "@/shared/components/ResponsiveTable";
import type { Category } from "../types";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface CategoryTableProps {
  categories: Category[];
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <ResponsiveTable
      ariaLabel="Evaluation categories"
      minWidth="560px"
      items={categories}
      rowKey={(category) => category.categoryId}
      columns={[
        {
          header: "Name",
          primary: true,
          cell: (category) => (
            <span className="font-medium text-foreground">
              {category.categoryName}
            </span>
          ),
        },
        {
          header: "Weight",
          cell: (category) => (
            <div className="flex items-center gap-2">
              <Progress
                value={Math.min(100, Math.max(0, category.categoryRate ?? 0))}
                className="w-20"
              />
              <span className="tabular-nums text-muted-foreground">
                {category.categoryRate ?? "—"}%
              </span>
            </div>
          ),
        },
      ]}
      actions={(category) => (
        <>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Edit ${category.categoryName}`}
            onClick={() => onEdit?.(category)}>
            <IconEdit />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${category.categoryName}`}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete?.(category)}>
            <IconTrash />
          </Button>
        </>
      )}
    />
  );
}
