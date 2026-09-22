import { useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { decodeToken } from "@/lib/jwt";
import { homePathFor } from "@/lib/home";

export function GoogleCallback() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/_auth/google-callback" });
  const { code, error } = search;
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    // If Google returned an error (user denied, etc.)
    if (error) {
      console.error("Google OAuth error:", error);
      navigate({ to: "/login", search: { error: "google_denied" } });
      return;
    }

    if (!code) {
      navigate({ to: "/login" });
      return;
    }

    // Exchange the code with our backend
    const exchangeCode = async () => {
      try {
        const { data } = await api.post("api/auth/google-callback", { code });
        const { token } = data;

        const claims = decodeToken(token);
        setToken(token);

        // Navigate to the default authenticated page (or based on role)
        navigate({ to: homePathFor(claims.role) });
      } catch (err) {
        console.error("Login failed:", err);
        navigate({ to: "/login", search: { error: "auth_failed" } });
      }
    };

    exchangeCode();
  }, [code, error, navigate, setToken]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Processing login...</p>
    </div>
  );
}
