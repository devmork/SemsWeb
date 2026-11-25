import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AuthLayout } from "./AuthLayout";
import { GoogleIcon } from "./GoogleIcon";
import { LOGIN_ERROR_MESSAGES } from "../constants";
import { useCredentialForm } from "../hooks/useCredentialForm";
import { startGoogleSignIn } from "../services/authService";

interface LoginCardProps {
  errorCode?: string | undefined;
}

export function LoginCard({ errorCode }: LoginCardProps) {
  const form = useCredentialForm("login");
  const errorMessage = errorCode
    ? (LOGIN_ERROR_MESSAGES[errorCode] ?? LOGIN_ERROR_MESSAGES.google_auth_failed)
    : null;

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in with your school ID and password."
      error={errorMessage}
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-foreground underline underline-offset-4">
            Sign up
          </Link>
        </>
      }>
      <form onSubmit={form.submit} noValidate className="flex flex-col gap-5">
        <FieldGroup className="gap-4 [&_input]:min-w-0">
          <Field data-invalid={!!form.errors.idNumber}>
            <FieldLabel htmlFor={form.fieldProps("idNumber").id}>
              ID number
            </FieldLabel>
            <Input
              inputMode="numeric"
              autoComplete="username"
              placeholder="2023-0444"
              {...form.fieldProps("idNumber")}
            />
            {form.errors.idNumber ? (
              <FieldError {...form.errorProps("idNumber")} />
            ) : null}
          </Field>

          <Field data-invalid={!!form.errors.password}>
            <FieldLabel htmlFor={form.fieldProps("password").id}>
              Password
            </FieldLabel>
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...form.fieldProps("password")}
            />
            {form.errors.password ? (
              <FieldError {...form.errorProps("password")} />
            ) : null}
          </Field>
        </FieldGroup>

        <Button type="submit" size="lg" className="w-full">
          Log in
          <ArrowRight data-icon="inline-end" aria-hidden="true" />
        </Button>
      </form>

      {form.notice ? (
        <p
          role="status"
          className="rounded-md border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
          {form.notice}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or continue with</span>
        <Separator className="flex-1" />
      </div>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => startGoogleSignIn()}>
        <GoogleIcon data-icon="inline-start" />
        Continue with Google
      </Button>
    </AuthLayout>
  );
}
