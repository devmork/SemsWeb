import { Button } from "@/components/ui/button";
import type { Question } from "../types";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface QuestionTableProps {
  questions: Question[];
  onEdit?: (question: Question) => void;
  onDelete?: (question: Question) => void;
}

export function QuestionTable({
  questions,
  onEdit,
  onDelete,
}: QuestionTableProps) {
  if (questions.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-hairline">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium">No questions yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a question to start building this category.
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
              Question
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr
              key={question.id}
              className="border-t border-hairline hover:bg-muted/40"
            >
              <td className="px-4 py-3 text-sm">
                {question.text}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit question ${question.id}`}
                    onClick={() => onEdit?.(question)}
                  >
                    <IconEdit />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete question ${question.id}`}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDelete?.(question)}
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
