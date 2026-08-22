"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { MIN_IMAGE_DIMENSION } from "@/lib/visualizer/treatments";

interface SelfieCaptureProps {
  onCapture: (dataUrl: string) => void;
  disabled?: boolean;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

async function validateImageDimensions(dataUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (img.width < MIN_IMAGE_DIMENSION || img.height < MIN_IMAGE_DIMENSION) {
        reject(
          new Error(
            `Photo must be at least ${MIN_IMAGE_DIMENSION}px on each side. Try moving closer or using a higher-resolution camera.`
          )
        );
        return;
      }
      resolve();
    };
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = dataUrl;
  });
}

export function SelfieCapture({ onCapture, disabled }: SelfieCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      if (!file.type.startsWith("image/")) {
        setError("Please upload a JPG, PNG, or WebP photo.");
        return;
      }

      try {
        const dataUrl = await readFileAsDataUrl(file);
        await validateImageDimensions(dataUrl);
        setPreview(dataUrl);
        onCapture(dataUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        setPreview(null);
      }
    },
    [onCapture]
  );

  return (
    <div className="space-y-4">
      <div
        className={`relative aspect-[3/4] max-w-md mx-auto rounded-lg border-2 border-dashed overflow-hidden transition-colors ${
          preview ? "border-rose-light bg-white" : "border-silver-light bg-silver-pale"
        }`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Your uploaded selfie" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-sm text-silver mb-2">Front-facing selfie, good lighting</p>
            <p className="text-xs text-silver-light">No filters · Hair away from face · Neutral expression</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="user"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          {preview ? "Choose Different Photo" : "Upload Selfie"}
        </Button>
      </div>

      {error && <p className="text-sm text-rose-dark text-center">{error}</p>}
    </div>
  );
}
