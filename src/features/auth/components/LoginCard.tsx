import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field";
import { Link } from "@tanstack/react-router";
import { AuthLayout } from "@/shared/layout";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleIcon } from "./GoogleIcon";
import { Info } from "lucide-react";

export function LoginCard() {
  const login = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: `${window.location.origin}/auth/google/callback`,
  });

  return (
    <AuthLayout
      title="Welcome back!"
      description="School Evaluation Management System"
      footer={
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-primary hover:underline">
            Create account
          </Link>
        </p>
      }>
      <FieldGroup>
        <Field>
          <div className="flex items-start gap-3 rounded-md border bg-muted/40 p-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Info className="h-3.5 w-3.5" />
            </span>
            <div className="text-sm">
              <p className="font-medium">School Account Required</p>
              <p className="text-muted-foreground">
                When signing in, you must use your official school-provided
                email address (@dmc.edu.ph).
              </p>
            </div>
          </div>
        </Field>

        <FieldSeparator />

        <Field>
          <Button
            type="button"
            variant="outline"
            className="w-full border-hairline"
            size="lg"
            onClick={() => login()}>
            <GoogleIcon />
            Continue with Google
          </Button>
        </Field>
      </FieldGroup>
    </AuthLayout>
  );
}
