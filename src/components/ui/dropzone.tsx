import { useEffect, useMemo, useRef, useState } from "react";

import { UploadCloud, X } from "lucide-react";

import { cn } from "@/lib/utils";

type DropzoneProps = {
  value: File[]; // ไฟล์ที่เลือกแล้ว
  onChange: (files: File[]) => void; // ส่งไฟล์กลับไปให้ form
  multiple?: boolean;
  accept?: string; // เช่น "image/*,.pdf"
  maxSizeMB?: number; // จำกัดขนาดต่อไฟล์
  isInvalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

export default function Dropzone({
  value,
  onChange,
  multiple = true,
  accept,
  maxSizeMB = 10,
  isInvalid,
  disabled,
  placeholder = "Drop files here or click to upload",
  className,
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const maxBytes = maxSizeMB * 1024 * 1024;

  const handlePick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const addFiles = (incoming: File[]) => {
    if (disabled) return;

    // filter: size
    const filtered = incoming.filter((f) => f.size <= maxBytes);

    // merge (กันชื่อซ้ำแบบเบา ๆ ตาม name+size+lastModified)
    const key = (f: File) => `${f.name}_${f.size}_${f.lastModified}`;
    const existingKeys = new Set(value.map(key));
    const merged = multiple
      ? [...value, ...filtered.filter((f) => !existingKeys.has(key(f)))]
      : filtered.slice(0, 1);

    onChange(merged);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    addFiles(files);
    // reset เพื่อเลือกไฟล์เดิมซ้ำได้
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files ?? []);
    addFiles(files);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeAt = (idx: number) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  };

  // preview สำหรับรูปภาพ (ทำแค่ที่จำเป็น + cleanup)
  const previews = useMemo(() => {
    return value.map((file) => ({
      file,
      isImage: file.type.startsWith("image/"),
      url: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
    }));
  }, [value]);

  useEffect(() => {
    return () => {
      previews.forEach((p) => p.url && URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        onClick={handlePick}
        onKeyDown={(e) =>
          e.key === "Enter" || e.key === " " ? handlePick() : null
        }
        onDrop={onDrop}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDragOver={onDragOver}
        className={cn(
          "w-full rounded-xl border border-dashed p-4",
          "bg-gray-100 transition-colors",
          "flex items-center justify-between gap-3",
          disabled && "cursor-not-allowed opacity-60",
          !disabled && "cursor-pointer hover:bg-gray-50",
          isDragging && "border-blue-400 bg-blue-50",
          isInvalid && "border-destructive",
          className,
        )}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <UploadCloud className="size-4 shrink-0" />
            <span className="truncate">{placeholder}</span>
          </div>

          <div className="mt-1 text-xs text-gray-500">
            {accept ? `Accept: ${accept} · ` : null}
            Max {maxSizeMB}MB / file
            {multiple ? " · Multiple" : " · Single"}
          </div>
        </div>

        <div className="shrink-0 text-xs text-gray-500">
          {value.length > 0 ? `${value.length} file(s)` : "No files"}
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={onInputChange}
          disabled={disabled}
          className="hidden"
        />
      </div>

      {/* List / Preview */}
      {value.length > 0 && (
        <div className="mt-3 space-y-2">
          {previews.map((p, idx) => (
            <div
              key={`${p.file.name}_${p.file.size}_${p.file.lastModified}`}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2"
            >
              {p.isImage ? (
                <img
                  src={p.url}
                  alt={p.file.name}
                  className="h-9 w-9 rounded border object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded border bg-gray-50 text-xs text-gray-500">
                  FILE
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-gray-900">
                  {p.file.name}
                </div>
                <div className="text-xs text-gray-500">
                  {(p.file.size / 1024).toFixed(0)} KB
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="shrink-0 rounded-md p-1 text-gray-500 hover:bg-red-50 hover:text-red-600"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
