"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import type * as React from "react";
import { cn } from "@/lib/utils";

type AvatarProps = AvatarPrimitive.Root.Props & {
  size?: "sm" | "default" | "lg";
};

const AVATAR_SIZE_CLASS: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "size-7",
  default: "size-8",
  lg: "size-12",
};

function Avatar({ className, size = "default", ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn([
        "relative flex shrink-0 overflow-hidden rounded-full",
        AVATAR_SIZE_CLASS[size],
        className,
      ])}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(["aspect-square size-full object-cover", className])}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn([
        "flex size-full items-center justify-center rounded-full bg-muted text-muted-foreground",
        className,
      ])}
      {...props}
    />
  );
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn([
        "absolute right-0 bottom-0 flex size-3.5 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm",
        className,
      ])}
      {...props}
    />
  );
}

export { Avatar, AvatarBadge, AvatarFallback, AvatarImage };
