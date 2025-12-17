import * as React from "react";

import { Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  // FileUploadTrigger,
} from "@/components/ui/file-upload";

interface FileUploaderProps {
  value?: File[];
  onValueChange?: (files: File[]) => void;
}

export function FileUploader({ value = [], onValueChange }: FileUploaderProps) {
  const onFileValidate = React.useCallback((file: File): string | null => {
    // Validate max files
    // if (files.length >= 2) {
    //   return "You can only upload up to 2 files";
    // }

    // Validate file type (only images)
    // if (!file.type.startsWith("image/")) {
    //   return "Only image files are allowed";
    // }

    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return `File size must be less than ${MAX_SIZE / (1024 * 1024)}MB`;
    }

    return null;
  }, []);

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  return (
    <FileUpload
      value={value}
      onValueChange={onValueChange}
      onFileValidate={onFileValidate}
      onFileReject={onFileReject}
      accept=".pdf,.jpg,.png"
      className="w-full"
      multiple
    >
      <FileUploadDropzone className="cursor-pointer">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="text-muted-foreground size-6" />
          </div>
          <p className="text-sm font-medium">Drag & drop files here</p>
          <p className="text-muted-foreground text-xs">Or click to browse</p>
          <p className="mt-2 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs text-gray-400">
            Support: PDF, JPG, PNG (Max 5MB)
          </p>
        </div>
        {/* <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit">
            Browse files
          </Button>
        </FileUploadTrigger> */}
      </FileUploadDropzone>
      <FileUploadList>
        {value.map((file) => (
          <FileUploadItem key={file.name} value={file}>
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <X />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}
