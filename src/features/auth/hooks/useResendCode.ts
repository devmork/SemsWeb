import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ContinueWithEmailInput } from "../auth.types";

export function useResendCode() {
  return useMutation({
    mutationFn: async (input: ContinueWithEmailInput) => {
      const { data } = await api.post("/auth/email/continue", input);
      return data;
    },
  });
}
