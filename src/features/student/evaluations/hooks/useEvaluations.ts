import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { evaluationService } from "../services/evaluationService";
import type {
  EvaluationDetail,
  EvaluationKind,
  SubmitEvaluationInput,
} from "../types";

export const evaluationKeys = {
  all: ["student", "evaluations"] as const,
  teachers: () => [...evaluationKeys.all, "teachers"] as const,
  facilities: () => [...evaluationKeys.all, "facilities"] as const,
  form: (evaluationTypeId: number) =>
    [...evaluationKeys.all, "form", evaluationTypeId] as const,
  session: (sessionId: number) =>
    [...evaluationKeys.all, "session", sessionId] as const,
};

export function useTeacherEvaluations(enabled = true) {
  return useQuery({
    queryKey: evaluationKeys.teachers(),
    queryFn: evaluationService.getTeacherEvaluations,
    enabled,
  });
}

export function useFacilityEvaluations(enabled = true) {
  return useQuery({
    queryKey: evaluationKeys.facilities(),
    queryFn: evaluationService.getFacilityEvaluations,
    enabled,
  });
}

/**
 * Composes an assignment with its form content. Teacher assignments resolve the
 * form through `/api/evaluation/form?evaluationTypeId=`; facility assignments
 * carry a session, so the form comes from `/api/evaluation/sessions/{id}`.
 */
export function useEvaluationDetail(id: number, type: EvaluationKind) {
  const teacherAssignments = useTeacherEvaluations(type === "teacher");
  const facilityAssignments = useFacilityEvaluations(type === "facility");

  const teacher =
    type === "teacher"
      ? teacherAssignments.data?.find((e) => e.subjectOfferingId === id)
      : undefined;

  const facility =
    type === "facility"
      ? facilityAssignments.data?.find((e) => e.facilityId === id)
      : undefined;

  const teacherForm = useQuery({
    queryKey: evaluationKeys.form(teacher?.evaluationTypeId ?? 0),
    queryFn: () =>
      evaluationService.getFormCategories(teacher!.evaluationTypeId!),
    enabled: type === "teacher" && teacher?.evaluationTypeId != null,
  });

  const facilitySession = useQuery({
    queryKey: evaluationKeys.session(facility?.evaluationSessionId ?? 0),
    queryFn: () =>
      evaluationService.getSessionCategories(facility!.evaluationSessionId),
    enabled: type === "facility" && facility != null,
  });

  const data = useMemo<EvaluationDetail | null>(() => {
    if (type === "teacher") {
      if (!teacher) return null;
      return {
        id: teacher.id,
        type: "teacher",
        title: teacher.subjectDescription || teacher.subjectCode,
        targetName: teacher.teacherName,
        targetSubtitle: [
          teacher.subjectCode,
          `Grade ${teacher.gradeLevel}`,
          teacher.section,
        ]
          .filter(Boolean)
          .join(" · "),
        dueDate: null,
        schoolYear: teacher.schoolYear,
        term: teacher.term,
        evaluationTypeId: teacher.evaluationTypeId,
        formId: teacher.formId,
        evaluationSessionId: null,
        categories: teacherForm.data ?? [],
      };
    }

    if (!facility) return null;
    return {
      id: facility.id,
      type: "facility",
      title: facility.facilityName,
      targetName: facility.facilityName,
      targetSubtitle: [facility.schoolYear, `Term ${facility.term}`]
        .filter(Boolean)
        .join(" · "),
      dueDate: facilitySession.data?.closesAtUtc ?? null,
      schoolYear: facility.schoolYear,
      term: facility.term,
      evaluationTypeId: facility.evaluationTypeId,
      formId: facility.formId,
      evaluationSessionId: facility.evaluationSessionId,
      categories: facilitySession.data?.categories ?? [],
    };
  }, [
    type,
    teacher,
    facility,
    teacherForm.data,
    facilitySession.data,
  ]);

  const isPending =
    type === "teacher"
      ? teacherAssignments.isPending ||
        (teacher?.evaluationTypeId != null && teacherForm.isPending)
      : facilityAssignments.isPending ||
        (facility != null && facilitySession.isPending);

  const isError =
    type === "teacher"
      ? teacherAssignments.isError || teacherForm.isError
      : facilityAssignments.isError || facilitySession.isError;

  return { data, isPending, isError };
}

export function useSubmitEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SubmitEvaluationInput) => {
      if (input.type === "teacher") {
        const {
          subjectOfferingId,
          evaluationTypeId,
          formId,
          schoolYear,
          term,
          evaluationSessionId,
          answers,
        } = input;
        return evaluationService.submitTeacherEvaluation({
          subjectOfferingId,
          evaluationTypeId,
          formId,
          schoolYear,
          term,
          evaluationSessionId,
          answers,
        });
      }

      const {
        facilityId,
        evaluationSessionId,
        evaluationTypeId,
        formId,
        answers,
      } = input;
      return evaluationService.submitFacilityEvaluation({
        facilityId,
        evaluationSessionId,
        evaluationTypeId,
        formId,
        answers,
      });
    },
    onSuccess: () => {
      // Refresh both lists so the "Start Evaluation" button flips to "Submitted".
      queryClient.invalidateQueries({ queryKey: evaluationKeys.teachers() });
      queryClient.invalidateQueries({ queryKey: evaluationKeys.facilities() });
    },
  });
}
