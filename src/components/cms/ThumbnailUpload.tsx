"use client";

import { ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  initialUrl?: string | null;
  name?: string;
  currentUrlName?: string;
};

export function ThumbnailUpload({
  initialUrl,
  name = "thumbnail_file",
  currentUrlName = "current_thumbnail_url",
}: Props) {
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [currentUrl, setCurrentUrl] = useState<string>(initialUrl ?? "");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const img = new window.Image();
    img.onload = () => {
      const MAX = 1080;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob || !inputRef.current) return;
          const webp = new File([blob], "thumbnail.webp", { type: "image/webp" });
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

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    setPreview(null);
    setCurrentUrl("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleClick() {
    inputRef.current?.click();
  }

  return (
    <div className={cn("w-full")}>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        className={cn("hidden")}
        onChange={handleInputChange}
      />
      <input type="hidden" name={currentUrlName} value={currentUrl} />

      {preview ? (
        <div className={cn("relative w-full rounded-lg overflow-hidden border border-border group")}>
          <div className={cn("relative w-full aspect-video")}>
            <Image
              src={preview}
              alt="Thumbnail"
              fill
              className={cn("object-cover")}
            />
          </div>
          <div
            className={cn(
              "absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3",
            )}
          >
            <button
              type="button"
              onClick={handleClick}
              className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "inline-flex items-center gap-1.5 rounded-md bg-white/90 text-foreground text-xs font-medium px-3 py-1.5",
                "hover:bg-white",
              )}
            >
              <Upload className={cn("size-3.5")} aria-hidden="true" />
              Trocar imagem
            </button>
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remover thumbnail"
              className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "inline-flex items-center gap-1.5 rounded-md bg-destructive/90 text-white text-xs font-medium px-3 py-1.5",
                "hover:bg-destructive",
              )}
            >
              <X className={cn("size-3.5")} aria-hidden="true" />
              Remover
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "w-full flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed py-10 px-6 transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/40",
          )}
        >
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-full",
              isDragging ? "bg-primary/10" : "bg-muted",
            )}
          >
            <ImageIcon
              className={cn("size-5", isDragging ? "text-primary" : "text-muted-foreground")}
              aria-hidden="true"
            />
          </div>
          <div className={cn("text-center")}>
            <p className={cn("text-sm font-medium text-foreground")}>
              Arraste e solte ou{" "}
              <span className={cn("text-primary underline-offset-2 hover:underline")}>
                clique para selecionar
              </span>
            </p>
            <p className={cn("text-xs text-muted-foreground mt-1")}>
              PNG, JPG, WebP — máx. 5 MB
            </p>
          </div>
        </button>
      )}
    </div>
  );
}
