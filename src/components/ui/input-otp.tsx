"use client";

import { OTPFieldPreview as OTPFieldPrimitive } from "@base-ui/react/otp-field";
import type * as React from "react";
import { cn } from "@/lib/utils";

function InputOTP({ className, ...props }: OTPFieldPrimitive.Root.Props) {
  return (
    <OTPFieldPrimitive.Root
      data-slot="input-otp"
      className={cn(["flex max-w-full items-center gap-2", className])}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(["flex max-w-full items-center gap-2", className])}
      {...props}
    />
  );
}

function InputOTPSlot({
  className,
  index,
  ...props
}: OTPFieldPrimitive.Input.Props & {
  index: number;
}) {
  return (
    <OTPFieldPrimitive.Input
      data-slot="input-otp-slot"
      data-slot-index={index}
      className={cn([
        "flex size-9 items-center justify-center rounded-lg border border-input bg-background text-center text-sm font-medium shadow-xs transition-all outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 sm:size-10",
        className,
      ])}
      {...props}
    />
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot };
