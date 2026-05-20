"use client";

import { Camera } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type AvatarDropzoneProps = {
  initialUrl?: string | null;
  fallback: string;
  name?: string;
  disabled?: boolean;
  fallbackClassName?: string;
};

export function AvatarDropzone({
  initialUrl,
  fallback,
  name = "avatar_file",
  disabled = false,
  fallbackClassName,
}: AvatarDropzoneProps) {
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);

    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setPreview(objectUrl);

    const img = new window.Image();
    img.onload = () => {
      const MAX = 400;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob || !inputRef.current) return;
          const webp = new File([blob], "avatar.webp", { type: "image/webp" });
          const dt = new DataTransfer();
          dt.items.add(webp);
          inputRef.current.files = dt.files;
        },
        "image/webp",
        0.85,
      );
    };
    img.src = objectUrl;
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleClick() {
    if (!disabled) inputRef.current?.click();
  }

  return (
    <div className={cn("flex flex-col items-center gap-3")}>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/png,image/jpeg,image/webp"
        className={cn("hidden")}
        onChange={handleInputChange}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={disabled}
        aria-label="Alterar foto de perfil"
        className={cn(
          "group relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
          isDragging && "ring-2 ring-primary ring-offset-2",
        )}
      >
        <Avatar
          className={cn(
            "size-28 border-4 border-background shadow-md ring-1 ring-border",
          )}
        >
          {preview && <AvatarImage src={preview} alt="Foto de perfil" />}
          <AvatarFallback
            className={cn("text-2xl font-bold", fallbackClassName)}
          >
            {fallback}
          </AvatarFallback>
        </Avatar>

        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-full",
            "bg-black/0 transition-colors",
            !disabled && "group-hover:bg-black/50",
            isDragging && "bg-black/50",
          )}
          aria-hidden="true"
        >
          <Camera
            className={cn(
              "size-5 text-white opacity-0 transition-opacity",
              !disabled && "group-hover:opacity-100",
              isDragging && "opacity-100",
            )}
          />
          <span
            className={cn(
              "text-[10px] font-medium leading-none text-white opacity-0 transition-opacity",
              !disabled && "group-hover:opacity-100",
              isDragging && "opacity-100",
            )}
          >
            {isDragging ? "Solte aqui" : "Trocar foto"}
          </span>
        </div>
      </button>

      <p className={cn("text-center text-xs text-muted-foreground")}>
        PNG, JPG ou WebP · máx. 5 MB · otimizado automaticamente
      </p>
    </div>
  );
}
