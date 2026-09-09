import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field";
import { AuthLayout } from "@/shared/layout";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleIcon } from "./GoogleIcon";
import { Info } from "lucide-react";

export function AuthCard() {
  const login = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
  });

  return (
    <AuthLayout
      title="Welcome to SEMS"
      description="School Evaluation Management System">
      <FieldGroup>
        <Field>
          <div className="flex items-start gap-3 rounded-md border bg-muted/40 p-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Info className="h-3.5 w-3.5" />
            </span>
            <div className="text-sm">
              <p className="font-medium">School Account Required</p>
              <p className="text-muted-foreground">
                Continue with your official school-provided email address
                (@dmc.edu.ph).
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
