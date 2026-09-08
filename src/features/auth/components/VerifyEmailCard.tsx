import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldError } from "@/components/ui/field";
import { Link } from "@tanstack/react-router";
import { AuthLayout } from "@/shared/layout";
import { useVerifyCode } from "../hooks/useVerifyCode";
import { useResendCode } from "../hooks/useResendCode";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const RESEND_COOLDOWN_SECONDS = 60;

interface VerifyEmailCardProps {
  mode: "login" | "signup";
  email: string;
  onUseDifferentEmail: () => void;
}

export function VerifyEmailCard({
  mode,
  email,
  onUseDifferentEmail,
}: VerifyEmailCardProps) {
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const {
    mutate: verifyCode,
    isPending: isVerifying,
    error: verifyError,
  } = useVerifyCode();
  const { mutate: resendCode, isPending: isResending } = useResendCode();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleComplete = (value: string) => {
    verifyCode({ email, code: value });
  };

  const handleResend = () => {
    resendCode({ email });
    setCooldown(RESEND_COOLDOWN_SECONDS);
  };

  const isLogin = mode === "login";

  return (
    <AuthLayout
      title={isLogin ? "Welcome back" : "Create account"}
      description={
        isLogin ? (
          "Sign in using dmc.edu.ph account"
        ) : (
          <>We suggest using the email address you use at work or school</>
        )
      }
      footer={
        isLogin ? (
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline">
              Sign In
            </Link>
          </p>
        )
      }>
      <FieldGroup>
        <Field>
          <p className="text-center text-sm text-muted-foreground">
            {isLogin
              ? "If you already have an account, we sent a code to"
              : "If you're new to SEMS, we sent a code to"}
            <br />
            <span className="font-semibold text-foreground">{email}</span>
          </p>
        </Field>

        <Field>
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            onComplete={handleComplete}
            disabled={isVerifying}
            autoFocus
            containerClassName="justify-center">
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot key={i} index={i} aria-invalid={!!verifyError} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          {verifyError && (
            <FieldError className="text-center">
              {verifyError instanceof Error
                ? verifyError.message
                : "Invalid code. Try again."}
            </FieldError>
          )}
        </Field>

        <Field>
          <Button
            type="button"
            variant="link"
            className="mx-auto w-fit text-sm font-medium text-primary"
            onClick={onUseDifferentEmail}>
            Use a Different Email
          </Button>
        </Field>

        <Field
          orientation="horizontal"
          className="justify-center gap-1 text-sm text-muted-foreground">
          <span>Didn&apos;t receive a code?</span>
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-sm font-semibold"
            disabled={cooldown > 0 || isResending}
            onClick={handleResend}>
            {cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
          </Button>
        </Field>
      </FieldGroup>
    </AuthLayout>
  );
}
