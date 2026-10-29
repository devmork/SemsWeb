import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field";
import { AuthLayout } from "@/shared/layout";
import { Info } from "lucide-react";
import { GoogleIcon } from "./GoogleIcon";
import { LOGIN_ERROR_MESSAGES, SCHOOL_EMAIL_DOMAIN } from "../constant";
import { startGoogleSignIn } from "../services/authService";

interface AuthCardProps {
  errorCode?: string | undefined;
}

export function AuthCard({ errorCode }: AuthCardProps) {
  const errorMessage = errorCode
    ? (LOGIN_ERROR_MESSAGES[errorCode] ??
      LOGIN_ERROR_MESSAGES.google_auth_failed)
    : null;

  return (
    <AuthLayout
      title="Welcome to SEMS"
      description="School Evaluation Management System">
      <FieldGroup>
        {errorMessage && (
          <Field>
            <p
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {errorMessage}
            </p>
          </Field>
        )}

        <Field>
          <div className="flex items-start gap-3 rounded-md border bg-muted/40 p-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Info className="h-3.5 w-3.5" />
            </span>
            <div className="text-sm">
              <p className="font-medium">School Account Required</p>
              <p className="text-muted-foreground">
                Continue with your official school-provided email address (@
                {SCHOOL_EMAIL_DOMAIN}).
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
            onClick={() => startGoogleSignIn()}>
            <GoogleIcon />
            Continue with Google
          </Button>
        </Field>
      </FieldGroup>
    </AuthLayout>
  );
}
