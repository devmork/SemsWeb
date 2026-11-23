import { Star } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

/** One rating per question: five large, 44px targets with a visible scale. */
export function Rating({ value, onChange, disabled }: StarRatingProps) {
  return (
    <div
      role="group"
      aria-label="Rating from 1 to 5"
      className="flex w-full min-w-0 flex-col items-center gap-1 md:w-auto">
      <div className="flex flex-wrap items-center justify-center gap-1 md:flex-nowrap md:gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            aria-pressed={star === value}
            aria-label={`Rate ${star} out of 5`}
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
              disabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:bg-muted motion-reduce:hover:bg-transparent",
            )}>
            <Star
              className={cn(
                "size-7 transition-transform sm:size-8",
                star <= value
                  ? "fill-brand-accent text-brand-accent"
                  : "text-muted-foreground/30",
              )}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
      {value > 0 ? (
        <span className="text-xs font-medium text-brand-accent sm:hidden">
          {value} of 5
        </span>
      ) : null}
      <div
        className="mt-1 hidden w-full max-w-[260px] justify-between px-2 text-[10px] font-medium text-muted-foreground uppercase sm:flex"
        aria-hidden="true">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
    </div>
  );
}
