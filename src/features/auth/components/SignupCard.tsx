import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { AuthLayout } from "@/shared/layout";
import { GoogleIcon } from "./GoogleIcon";
import { type ContinueWithEmailInput } from "../auth.types";
import { useContinueWithEmail } from "../hooks/useContinueWithEmail";

export function SignupCard() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContinueWithEmailInput>();
  const {
    mutate: continueWithEmail,
    isPending,
    error,
  } = useContinueWithEmail();

  const onSubmit = (values: ContinueWithEmailInput) => {
    continueWithEmail(values);
  };

  const handleGoogleSignup = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const emailFieldRules = {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Enter a valid email address",
    },
  } as const;

  return (
    <AuthLayout
      title="Create account"
      description={
        <>We suggest using the email address provided by the school.</>
      }
      footer={
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </p>
      }>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email" className="sr-only">
              Email
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="you@dmc.edu.ph"
              className="rounded-xs"
              aria-invalid={!!errors.email}
              {...register("email", emailFieldRules)}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <Field>
            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={isPending}>
              {isPending ? "Sending…" : "Continue with Email"}
            </Button>
            {error && (
              <p className="mt-1 text-center text-sm text-destructive">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong. Try again."}
              </p>
            )}
          </Field>

          <FieldSeparator>OR</FieldSeparator>

          <Field>
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full border-hairline"
              onClick={handleGoogleSignup}>
              <GoogleIcon />
              Continue with Google
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </AuthLayout>
  );
}
