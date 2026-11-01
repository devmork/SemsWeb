import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const BOOT_SEQUENCE = [
  "Verifying Google credentials...",
  "Synchronizing student profile...",
  "Fetching academic records...",
  "Decrypting access tokens...",
  "Access granted.",
];

export default function BootLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fill the progress bar over ~2.5 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Calculate which label to show based on progress
  // e.g., 0-20% shows index 0, 20-40% shows index 1, etc.
  const stepIndex = Math.min(
    Math.floor((progress / 100) * BOOT_SEQUENCE.length),
    BOOT_SEQUENCE.length - 1,
  );
  const currentLabel = BOOT_SEQUENCE[stepIndex];

  return (
    <div className="fixed inset-0 z-50 flex min-h-svh items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header Text */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome to SEMS
          </h1>
          <p className="text-sm text-muted-foreground">
            Please wait while we set up your dashboard.
          </p>
        </div>

        {/* Progress Component */}
        <Progress value={progress} className="w-full">
          <div className="mb-2 flex w-full items-center justify-between">
            {/* The label changes dynamically based on progress */}
            <span className="text-sm font-medium text-foreground transition-all duration-300">
              {currentLabel}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {progress}%
            </span>
          </div>
        </Progress>
      </div>
    </div>
  );
}
