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
import { Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/shared/layout";
import { type ContinueWithEmailInput } from "../auth.types";
import { useContinueWithEmail } from "../hooks/useContinueWithEmail";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleIcon } from "./GoogleIcon";

export function LoginCard() {
  const navigate = useNavigate();
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
    continueWithEmail(values, {
      onSuccess: () =>
        navigate({
          to: "/verify",
          search: { email: values.email, mode: "login" },
        }),
    });
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });

  const emailFieldRules = {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s  @]+$/,
      message: "Enter a valid email address",
    },
  } as const;

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in using dmc.edu.ph account"
      footer={
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-primary hover:underline">
            Sign up
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
            <Button type="submit" className="w-full" disabled={isPending}>
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
              className="w-full border-hairline"
              size="lg"
              onClick={() => login()}>
              <GoogleIcon />
              Sign in with Google
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </AuthLayout>
  );
}
