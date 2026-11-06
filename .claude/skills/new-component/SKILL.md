---
name: new-component
description: Generate a new UI component following SemsWeb conventions (CVA, cn, forwardRef, Tailwind)
disable-model-invocation: false
---

# New Component Skill

Generates a React component file following the project's established patterns.

## Conventions enforced

- Uses `cn` from `src/lib/cn` for class merging
- Uses `class-variance-authority` (`cva`) for variant APIs
- Uses `forwardRef` for DOM element refs
- Placed in `src/components/ui/` (shared) or `src/features/<name>/components/` (feature-scoped)
- Exports TypeScript props interface

## Usage

`/new-component <ComponentName> [variantProps] [feature]`

- `ComponentName` — PascalCase component name
- `variantProps` — optional comma-separated variant keys (e.g., `size, intent`)
- `feature` — optional feature folder (e.g., `evaluation-session`, `auth`)

## Example output (`src/components/ui/Button.tsx`)

```tsx
import * as React from "react"
import { cn } from "@/lib/cn"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      intent: {
        primary: "bg-forest-ivy text-white hover:bg-forest-ivy/90",
        secondary: "bg-stone text-deep-ink hover:bg-stone/80",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, ...props }), className)}
      {...props}
    />
  )
)
Button.displayName = "Button"
```
