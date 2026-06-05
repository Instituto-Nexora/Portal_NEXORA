"use client";

import { RotateCcw } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type AvatarCropDialogProps = {
  imageUrl: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCrop: (file: File, previewUrl: string) => void;
};

type ImageSize = {
  width: number;
  height: number;
};

const OUTPUT_SIZE = 400;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

function createImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

export function AvatarCropDialog({
  imageUrl,
  open,
  onOpenChange,
  onCrop,
}: AvatarCropDialogProps) {
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open) {
      setZoom(MIN_ZOOM);
      setOffsetX(0);
      setOffsetY(0);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const handleReset = useCallback(() => {
    setZoom(MIN_ZOOM);
    setOffsetX(0);
    setOffsetY(0);
  }, []);

  const handleCrop = useCallback(async () => {
    if (!imageUrl) return;

    const image = await createImage(imageUrl);
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;

    const context = canvas.getContext("2d");
    if (!context) return;

    const baseScale = Math.max(
      OUTPUT_SIZE / image.naturalWidth,
      OUTPUT_SIZE / image.naturalHeight,
    );
    const scale = baseScale * zoom;
    const scaledWidth = image.naturalWidth * scale;
    const scaledHeight = image.naturalHeight * scale;

    context.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    context.drawImage(
      image,
      OUTPUT_SIZE / 2 - scaledWidth / 2 + offsetX,
      OUTPUT_SIZE / 2 - scaledHeight / 2 + offsetY,
      scaledWidth,
      scaledHeight,
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);

        const file = new File([blob], "avatar.webp", { type: "image/webp" });
        const previewUrl = URL.createObjectURL(blob);
        previewUrlRef.current = previewUrl;
        onCrop(file, previewUrl);
        onOpenChange(false);
      },
      "image/webp",
      0.9,
    );
  }, [imageUrl, offsetX, offsetY, onCrop, onOpenChange, zoom]);

  const basePreviewScale = imageSize
    ? Math.max(256 / imageSize.width, 256 / imageSize.height)
    : 1;
  const previewWidth = imageSize?.width
    ? imageSize.width * basePreviewScale * zoom
    : 256;
  const previewHeight = imageSize?.height
    ? imageSize.height * basePreviewScale * zoom
    : 256;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(["sm:max-w-md"])}>
        <DialogHeader>
          <DialogTitle>Ajustar foto de perfil</DialogTitle>
          <DialogDescription>
            Posicione a imagem dentro do círculo antes de enviar.
          </DialogDescription>
        </DialogHeader>

        <div className={cn(["grid gap-5"])}>
          <div className={cn(["flex justify-center"])}>
            <div
              className={cn([
                "relative size-64 overflow-hidden rounded-full border-4 border-background bg-muted shadow-md ring-1 ring-border",
              ])}
            >
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Pré-visualização do recorte do avatar"
                  width={Math.round(previewWidth)}
                  height={Math.round(previewHeight)}
                  unoptimized
                  className={cn([
                    "absolute max-w-none select-none object-cover",
                  ])}
                  style={{
                    width: `${previewWidth}px`,
                    height: `${previewHeight}px`,
                    left: `calc(50% + ${offsetX * 0.64}px)`,
                    top: `calc(50% + ${offsetY * 0.64}px)`,
                    transform: "translate(-50%, -50%)",
                  }}
                  draggable={false}
                  onLoad={(event) => {
                    setImageSize({
                      width: event.currentTarget.naturalWidth,
                      height: event.currentTarget.naturalHeight,
                    });
                  }}
                />
              )}
            </div>
          </div>

          <div className={cn(["grid gap-3"])}>
            <div className={cn(["grid gap-2"])}>
              <Label htmlFor="avatar-crop-zoom">Zoom</Label>
              <input
                id="avatar-crop-zoom"
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step="0.05"
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className={cn(["accent-primary"])}
              />
            </div>

            <div className={cn(["grid gap-2"])}>
              <Label htmlFor="avatar-crop-x">Posição horizontal</Label>
              <input
                id="avatar-crop-x"
                type="range"
                min={-160}
                max={160}
                step="1"
                value={offsetX}
                onChange={(event) => setOffsetX(Number(event.target.value))}
                className={cn(["accent-primary"])}
              />
            </div>

            <div className={cn(["grid gap-2"])}>
              <Label htmlFor="avatar-crop-y">Posição vertical</Label>
              <input
                id="avatar-crop-y"
                type="range"
                min={-160}
                max={160}
                step="1"
                value={offsetY}
                onChange={(event) => setOffsetY(Number(event.target.value))}
                className={cn(["accent-primary"])}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleReset}>
            <RotateCcw className={cn(["size-4"])} />
            Centralizar
          </Button>
          <Button type="button" onClick={handleCrop} disabled={!imageUrl}>
            Usar recorte
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
