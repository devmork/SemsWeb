import type { ReactNode } from "react";
import { GraduationCap } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface AuthLayoutProps {
  title: string;
  description: ReactNode;
  children: ReactNode;
  /** Rendered below the form, typically the link to the other auth screen. */
  footer?: ReactNode;
  /** Query-level auth error, shown above the form. */
  error?: string | null | undefined;
  className?: string;
}

/**
 * Shared shell for every auth screen: brand content on the left, credential
 * fields on the right. Both LoginCard and SignupCard render through it.
 */
export function AuthLayout({
  title,
  description,
  children,
  footer,
  error,
  className,
}: AuthLayoutProps) {
  return (
    <div className={cn("flex min-h-svh w-full", className)}>
      <div className="hidden w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-8" aria-hidden="true" />
          <span className="text-xl font-bold tracking-tight">SEMS</span>
        </div>
        <div className="flex max-w-md flex-col gap-4">
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            School Evaluation
            <br />
            Management System
          </h1>
          <p className="text-lg text-primary-foreground/70">
            A centralized platform for managing school evaluations, tracking
            performance, and gaining actionable insights.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} DMC College Foundation
        </p>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center bg-background p-6 pb-24">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {error ? (
            <p
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {children}

          {footer ? (
            <p className="text-center text-sm text-muted-foreground">{footer}</p>
          ) : null}

          <p className="text-center text-xs text-muted-foreground">
            Powered by CCS - Developers
          </p>
        </div>
      </div>
    </div>
  );
}
