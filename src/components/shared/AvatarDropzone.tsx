"use client";

import { Camera } from "lucide-react";
import type * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AvatarCropDialog } from "./AvatarCropDialog";

type AvatarDropzoneProps = {
  initialUrl?: string | null;
  fallback: string;
  name?: string;
  disabled?: boolean;
  fallbackClassName?: string;
};

function setInputFile(input: HTMLInputElement | null, file: File) {
  if (!input) return;

  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  input.files = dataTransfer.files;
}

export function AvatarDropzone({
  initialUrl,
  fallback,
  name = "avatar_file",
  disabled = false,
  fallbackClassName,
}: AvatarDropzoneProps) {
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null);
  const [isCropOpen, setCropOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cropSourceUrlRef = useRef<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (cropSourceUrlRef.current)
        URL.revokeObjectURL(cropSourceUrlRef.current);
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;

    if (cropSourceUrlRef.current) URL.revokeObjectURL(cropSourceUrlRef.current);

    const objectUrl = URL.createObjectURL(file);
    cropSourceUrlRef.current = objectUrl;
    setCropImageUrl(objectUrl);
    setCropOpen(true);
  }, []);

  const handleCrop = useCallback((file: File, previewUrl: string) => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);

    previewUrlRef.current = previewUrl;
    setPreview(previewUrl);
    setInputFile(inputRef.current, file);
  }, []);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(event: React.DragEvent) {
    event.preventDefault();
    if (!disabled) setIsDragging(true);
  }

  function handleDragLeave(event: React.DragEvent) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = event.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleClick() {
    if (!disabled) inputRef.current?.click();
  }

  return (
    <div className={cn(["flex flex-col items-center gap-3"])}>
      <AvatarCropDialog
        imageUrl={cropImageUrl}
        open={isCropOpen}
        onOpenChange={setCropOpen}
        onCrop={handleCrop}
      />

      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/png,image/jpeg,image/webp"
        className={cn(["hidden"])}
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
        className={cn([
          "group relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          {
            "cursor-not-allowed opacity-60": disabled,
            "cursor-pointer": !disabled,
            "ring-2 ring-primary ring-offset-2": isDragging,
          },
        ])}
      >
        <Avatar
          className={cn([
            "size-28 border-4 border-background bg-muted shadow-md ring-1 ring-border",
          ])}
        >
          {preview && <AvatarImage src={preview} alt="Foto de perfil" />}
          <AvatarFallback
            className={cn([
              "bg-gradient-to-br from-primary to-teal-700 text-2xl font-bold text-primary-foreground",
              fallbackClassName,
            ])}
          >
            {fallback}
          </AvatarFallback>
        </Avatar>

        <div
          className={cn([
            "absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-full bg-black/0 transition-colors",
            {
              "group-hover:bg-black/50": !disabled,
              "bg-black/50": isDragging,
            },
          ])}
          aria-hidden="true"
        >
          <Camera
            className={cn([
              "size-5 text-white opacity-0 transition-opacity",
              {
                "group-hover:opacity-100": !disabled,
                "opacity-100": isDragging,
              },
            ])}
          />
          <span
            className={cn([
              "text-[10px] font-medium leading-none text-white opacity-0 transition-opacity",
              {
                "group-hover:opacity-100": !disabled,
                "opacity-100": isDragging,
              },
            ])}
          >
            {isDragging ? "Solte aqui" : "Trocar foto"}
          </span>
        </div>
      </button>

      <p className={cn(["text-center text-xs text-muted-foreground"])}>
        PNG, JPG ou WebP · máx. 5 MB · recorte e otimização automáticos
      </p>
    </div>
  );
}
