import { useAuthStore } from "@/features/auth";

/**
 * The academic profile is a read model over the authenticated session, so this
 * hook intentionally depends on the auth feature's public session store.
 */
export function useProfile() {
  const user = useAuthStore((s) => s.user);

  return {
    user,
    profile: user?.studentProfile ?? null,
  };
}
