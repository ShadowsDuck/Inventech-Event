"use client";

import { TriangleAlert, User, X } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  type FileWithPreview,
  formatBytes,
  useFileUpload,
} from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  maxSize?: number;
  className?: string;
  onFileChange?: (file: FileWithPreview | null) => void;
  defaultAvatar?: string;
}

export default function AvatarUpload({
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
  onFileChange,
  defaultAvatar,
}: AvatarUploadProps) {
  const [
    { files, isDragging, errors },
    {
      removeFile,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept: "image/*",
    multiple: false,
    onFilesChange: (files) => {
      onFileChange?.(files[0] || null);
    },
  });

  const currentFile = files[0];
  const previewUrl = currentFile?.preview || defaultAvatar;

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // กันไม่ให้ไปกดโดน input file ข้างหลัง

    if (currentFile) {
      // กรณี 1: ลบไฟล์ที่เพิ่งอัปโหลด (เคลียร์ State ใน Hook)
      removeFile(currentFile.id);
    } else {
      // กรณี 2: ลบรูปเดิมจาก DB (ส่ง null กลับไปบอก Parent)
      onFileChange?.(null);
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Avatar Preview */}
      <div className="relative">
        <div
          className={cn(
            "group/avatar relative h-32 w-32 cursor-pointer overflow-hidden rounded-full border border-dashed transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/20",
            previewUrl && "border-solid",
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input {...getInputProps()} className="sr-only" />

          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="text-muted-foreground size-10" />
            </div>
          )}
        </div>

        {/* Remove Button */}
        {(currentFile || defaultAvatar) && (
          <Button
            size="icon"
            variant="outline"
            type="button"
            onClick={handleRemove}
            className="bg-destructive hover:bg-destructive/90 transition-color absolute end-0 top-0 size-6 rounded-full border-2 border-white shadow-sm"
            aria-label="Remove avatar"
          >
            <X className="size-3.5 text-white" />
          </Button>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="space-y-0.5 text-center">
        <p className="text-sm font-medium">
          {currentFile ? "Profile uploaded" : "Upload profile"}
        </p>
        <p className="text-muted-foreground text-xs">
          PNG, JPG up to {formatBytes(maxSize)}
        </p>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="mt-5 w-1/2">
          <TriangleAlert />
          <AlertTitle>File upload error(s)</AlertTitle>
          <AlertDescription>
            {errors.map((error, index) => (
              <p key={index} className="last:mb-0">
                {error}
              </p>
            ))}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
