import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import type { VerifyCodeInput, VerifyCodeResponse } from "../auth.types";

// TODO: point at the real SeamsApp verify endpoint once confirmed.
export function useVerifyCode() {
  const setToken = useAuthStore((s) => s.setToken);

  return useMutation({
    mutationFn: async (input: VerifyCodeInput) => {
      const { data } = await api.post<VerifyCodeResponse>(
        "/auth/email/verify",
        input,
      );
      return data;
    },
    onSuccess: (data) => {
      setToken(data.token);
    },
  });
}
