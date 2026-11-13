import { useMemo, useState } from "react";
import { useFacilityEvaluations } from "../hooks/useEvaluations";
import { EvaluationPageLayout } from "./EvaluationPageLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FacilityEvaluationCard } from "./FacilityEvaluationCard";

export function FacilityEvaluationList() {
  const { data, isPending, isError } = useFacilityEvaluations();
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (typeFilter === "all") return data;
    return data.filter((e) => e.category === typeFilter);
  }, [data, typeFilter]);

  return (
    <EvaluationPageLayout
      title="Facility Evaluations"
      isLoading={isPending}
      isError={isError}
      count={filteredData.length}
      total={data?.length || 0}
      filters={
        <div className="flex flex-col gap-1.5 w-full sm:w-[180px]">
          <span className="text-xs font-medium text-muted-foreground">
            Facility Type
          </span>
          <Select
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value ?? "all")}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="clinic">Clinic</SelectItem>
              <SelectItem value="canteen">Canteen</SelectItem>
              <SelectItem value="library">Library</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }>
      {filteredData.map((evaluation) => (
        <FacilityEvaluationCard key={evaluation.id} evaluation={evaluation} />
      ))}
    </EvaluationPageLayout>
  );
}
