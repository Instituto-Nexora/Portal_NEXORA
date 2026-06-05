"use client"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cn } from "@/lib/utils"

type ProgressProps = ProgressPrimitive.Root.Props & {
  indicatorClassName?: string
}

function Progress({ className, indicatorClassName, value, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)}
      {...props}
    >
      <ProgressPrimitive.Track className={cn("size-full")}>
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={cn("h-full w-full flex-1 bg-primary transition-transform", indicatorClassName)}
          style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
