import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  formCategoryService,
} from "../services/formCategoryService";
import type {
  CreateFormCategoryInput,
  UpdateFormCategoryInput,
} from "../types";

export const formCategoryKeys = {
  all: ["form-categories"] as const,
  list: (formId: number) => [...formCategoryKeys.all, "list", formId] as const,
};

export function useFormCategories(formId: number) {
  return useQuery({
    queryKey: formCategoryKeys.list(formId),
    queryFn: () => formCategoryService.getFormCategories(formId),
    enabled: formId > 0,
  });
}

export function useCreateFormCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateFormCategoryInput) =>
      formCategoryService.addFormCategory(input),
    onSettled: (_data, _err, input) =>
      queryClient.invalidateQueries({
        queryKey: formCategoryKeys.list(input.formId),
      }),
  });
}

export function useUpdateFormCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      formId,
      input,
    }: {
      formId: number;
      input: UpdateFormCategoryInput;
    }) => formCategoryService.updateFormCategory(formId, input),
    onSettled: (_data, _err, vars) =>
      queryClient.invalidateQueries({
        queryKey: formCategoryKeys.list(vars.formId),
      }),
  });
}

export function useDeleteFormCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ formId, formCategoryId }: { formId: number; formCategoryId: number }) =>
      formCategoryService.removeFormCategory(formId, formCategoryId),
    onSettled: (_data, _err, vars) =>
      queryClient.invalidateQueries({
        queryKey: formCategoryKeys.list(vars.formId),
      }),
  });
}
