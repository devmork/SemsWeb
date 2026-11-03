import { useMemo, useState } from "react";
import { useTeacherEvaluations } from "../hooks/useEvaluations";
import { EvaluationPageLayout } from "./EvaluationPageLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeacherEvaluationCard } from "./TeacherEvaluationCard";

export default function TeacherEvaluationList() {
  const { data, isPending, isError } = useTeacherEvaluations();
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (statusFilter === "all") return data;
    return data.filter((e) => e.status === statusFilter);
  }, [data, statusFilter]);

  return (
    <EvaluationPageLayout
      title="Teacher Evaluations"
      isLoading={isPending}
      isError={isError}
      count={filteredData.length}
      total={data?.length || 0}
      filters={
        <div className="flex flex-col gap-1.5 w-full sm:w-[180px]">
          <span className="text-xs font-medium text-muted-foreground">
            Status
          </span>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value ?? "all")}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }>
      {filteredData.map((evaluation) => (
        <TeacherEvaluationCard key={evaluation.id} evaluation={evaluation} />
      ))}
    </EvaluationPageLayout>
  );
}
