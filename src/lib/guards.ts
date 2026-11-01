import { redirect } from "@tanstack/react-router";
import { fetchCurrentUser } from "@/features/auth";
import { homePathFor } from "@/lib/home";
import { useAuthStore } from "@/stores/auth.store";
import type { UserResponse, UserRole } from "@/types/domain";

let sessionPromise: Promise<UserResponse | null> | null = null;

const isDev = import.meta.env.DEV;

const MOCK_DEV_USER: UserResponse = {
  id: 1,
  name: "Den Mark Enoy",
  email: "den_enoy@dmc.edu.ph",
  role: "student",
  pictureUrl: null,
  studentProfile: {
    schoolStudentId: "2023-0444",
    program: "BSIT",
    yearLevel: "3",
    academicYear: "2026-2027",
    semester: "1",
    enrollmentStatus: "Enrolled",
    suffix: null,
  },
};

export function restoreSession(): Promise<UserResponse | null> {
  if (isDev) {
    useAuthStore.getState().setUser(MOCK_DEV_USER);
    return Promise.resolve(MOCK_DEV_USER);
  }

  const cached = useAuthStore.getState().user;
  if (cached) return Promise.resolve(cached);

  if (!sessionPromise) {
    sessionPromise = fetchCurrentUser()
      .then((user) => {
        if (user) useAuthStore.getState().setUser(user);
        return user;
      })
      .finally(() => {
        sessionPromise = null;
      });
  }
  return sessionPromise;
}

export async function requireAuth(): Promise<UserResponse> {
  const user = await restoreSession();
  if (!user) throw redirect({ to: "/login" });
  return user;
}

export async function requireRole(...allowed: UserRole[]): Promise<void> {
  const user = await requireAuth();
  if (!user.role || !allowed.includes(user.role)) {
    throw redirect({ to: "/forbidden" });
  }
}

export async function redirectIfAuthenticated(): Promise<void> {
  const user = await restoreSession();
  if (user) throw redirect({ to: homePathFor(user.role) });
}
