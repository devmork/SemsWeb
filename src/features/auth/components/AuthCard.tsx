import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { GoogleIcon } from "./GoogleIcon";
import { LOGIN_ERROR_MESSAGES, SCHOOL_EMAIL_DOMAIN } from "../constants";
import { startGoogleSignIn } from "../services/authService";
import { Info } from "lucide-react";

interface AuthCardProps {
  errorCode?: string | undefined;
}

export function AuthCard({ errorCode }: AuthCardProps) {
  const errorMessage = errorCode
    ? (LOGIN_ERROR_MESSAGES[errorCode] ?? LOGIN_ERROR_MESSAGES.google_auth_failed)
    : null;

  return (
    <div className="flex min-h-svh w-full">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-8" aria-hidden="true" />
          <span className="text-xl font-bold tracking-tight">SEMS</span>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            School Evaluation
            <br />
            Management System
          </h1>
          <p className="max-w-md text-lg text-primary-foreground/70">
            Collect, manage, and analyze teacher and facility evaluations — all
            in one place.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} DMC College Foundation
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background p-6">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex flex-col gap-2 text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Sign in with your school account to continue.
            </p>
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {errorMessage}
            </p>
          )}

          <div className="flex items-start gap-3 rounded-md border bg-muted/40 p-3">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Info className="size-3.5" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-0.5 text-sm">
              <p className="font-medium">School Account Required</p>
              <p className="text-muted-foreground">
                Use your official school email (@{SCHOOL_EMAIL_DOMAIN}).
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => startGoogleSignIn()}>
            <GoogleIcon data-icon="inline-start" />
            Continue with Google
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Powered by CCS - Developers
          </p>
        </div>
      </div>
    </div>
  );
}
