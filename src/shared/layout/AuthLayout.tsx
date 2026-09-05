import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
  className?: string;
}

export function AuthLayout({
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        "flex min-h-svh flex-col items-center justify-center bg-canvas-soft p-6",
        className,
      )}>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card className="border border-hairline shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="text-[26px] font-bold tracking-tight">
              {title}
            </CardTitle>
            <CardDescription className="text-[15px]">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
        <div className="flex flex-col items-center gap-1 text-center">
          {footer}
          <p className="text-xs text-muted-foreground">
            Powered by CCS - Developers v0.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
