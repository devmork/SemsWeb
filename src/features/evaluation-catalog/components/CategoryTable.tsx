import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  if (categories.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-hairline">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium">No categories yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a category to start organizing questions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-hairline">
      <table className="w-full min-w-[560px] text-left">
        <thead>
          <tr className="bg-canvas-soft">
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Weight
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Questions
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr
              key={category.id}
              className="border-t border-hairline hover:bg-muted/40"
            >
              <td className="px-4 py-3 text-sm font-medium">
                {category.catName}
              </td>
              <td className="px-4 py-3">
                <div className="flex min-w-32 items-center gap-2">
                  <Progress
                    value={Math.min(100, Math.max(0, category.catRate))}
                    className="w-20"
                  />
                  <span className="text-sm tabular-nums">
                    {category.catRate}%
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground tabular-nums">
                {category.questionCount}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${category.catName}`}
                    onClick={() => onEdit?.(category)}
                  >
                    <IconEdit />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${category.catName}`}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDelete?.(category)}
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
