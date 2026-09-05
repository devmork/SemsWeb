import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ContinueWithEmailInput } from "../auth.types";

interface ContinueWithEmailResponse {
  status: "otp_sent" | "link_sent";
}

// TODO: point at the real SeamsApp auth endpoint once it's confirmed —
// this assumes a passwordless email flow (OTP or magic link).
export function useContinueWithEmail() {
  return useMutation({
    mutationFn: async (input: ContinueWithEmailInput) => {
      const { data } = await api.post<ContinueWithEmailResponse>(
        "/auth/email/continue",
        input,
      );
      return data;
    },
  });
}
