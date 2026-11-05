import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function Rating({ value, onChange, disabled }: StarRatingProps) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[200px]">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            className={cn(
              "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full p-1",
              disabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:scale-110",
            )}
            aria-label={`Rate ${star} out of 5`}>
            <Star
              className={cn(
                "size-8 transition-all",
                star <= value
                  ? "fill-brand-accent text-brand-accent" // Using your brand accent instead of amber
                  : "text-muted-foreground/30",
              )}
            />
          </button>
        ))}
      </div>
      <div className="flex w-full justify-between px-3 text-[10px] font-medium text-muted-foreground uppercase mt-1">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
    </div>
  );
}
