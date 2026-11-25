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
import { useCredentialForm } from "../hooks/useCredentialForm";
import { startGoogleSignIn } from "../services/authService";

export function SignupCard() {
  const form = useCredentialForm("signup");

  return (
    <AuthLayout
      title="Create your account"
      description="Use your school ID to join the evaluation portal."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-foreground underline underline-offset-4">
            Log in
          </Link>
        </>
      }>
      <form onSubmit={form.submit} noValidate className="flex flex-col gap-5">
        <FieldGroup className="gap-4 [&_input]:min-w-0">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
            <Field data-invalid={!!form.errors.firstName}>
              <FieldLabel htmlFor={form.fieldProps("firstName").id}>
                First name
              </FieldLabel>
              <Input
                autoComplete="given-name"
                {...form.fieldProps("firstName")}
              />
              {form.errors.firstName ? (
                <FieldError {...form.errorProps("firstName")} />
              ) : null}
            </Field>
            <Field data-invalid={!!form.errors.lastName}>
              <FieldLabel htmlFor={form.fieldProps("lastName").id}>
                Last name
              </FieldLabel>
              <Input
                autoComplete="family-name"
                {...form.fieldProps("lastName")}
              />
              {form.errors.lastName ? (
                <FieldError {...form.errorProps("lastName")} />
              ) : null}
            </Field>
          </div>

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
              autoComplete="new-password"
              placeholder="••••••••"
              {...form.fieldProps("password")}
            />
            {form.errors.password ? (
              <FieldError {...form.errorProps("password")} />
            ) : null}
          </Field>

          <Field data-invalid={!!form.errors.confirmPassword}>
            <FieldLabel htmlFor={form.fieldProps("confirmPassword").id}>
              Confirm password
            </FieldLabel>
            <Input
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              {...form.fieldProps("confirmPassword")}
            />
            {form.errors.confirmPassword ? (
              <FieldError {...form.errorProps("confirmPassword")} />
            ) : null}
          </Field>
        </FieldGroup>

        <Button type="submit" size="lg" className="w-full">
          Create account
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
