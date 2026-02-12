import React from "react";

import {
  Download,
  File,
  FileSpreadsheet,
  FileText,
  Image,
  Paperclip,
} from "lucide-react";

import type { EventType } from "@/types/event";

// หรือ path ที่ถูกต้องของคุณ

// นิยาม Interface ของไฟล์ที่ใช้แสดงผลภายใน component นี้
interface DocumentItem {
  name: string;
  size: string;
  type: string;
  url: string;
}

interface EventDocumentsProps {
  events: EventType;
}

export default function EventDocuments({ events }: EventDocumentsProps) {
  // 1. Helper Function: แปลงขนาดไฟล์ (bytes -> KB/MB)
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // 2. Helper Function: แยกประเภทไฟล์จาก Content Type หรือ นามสกุล
  const getFileType = (contentType: string, fileName: string): string => {
    if (contentType.includes("pdf")) return "pdf";
    if (contentType.includes("image")) return "image";
    if (
      contentType.includes("sheet") ||
      contentType.includes("excel") ||
      fileName.endsWith("xlsx") ||
      fileName.endsWith("xls")
    )
      return "xlsx";
    if (
      contentType.includes("word") ||
      fileName.endsWith("docx") ||
      fileName.endsWith("doc")
    )
      return "docx";
    return "other";
  };
  const API_BASE_URL = "https://localhost:7268";
  // 3. แปลงข้อมูลจาก events.eventAttachments ให้เป็น DocumentItem[]
  const documents: DocumentItem[] =
    events.eventAttachments?.map((att) => ({
      name: att.originalFileName,
      size: formatFileSize(att.fileSize),
      type: getFileType(att.contentType || "", att.originalFileName || ""),
      url: att.filePath
        ? `${API_BASE_URL}/uploads/${att.filePath.replace(/\\/g, "/")}`
        : "#",
    })) || [];

  // 4. UI Helper: เลือก Icon ตามประเภทไฟล์
  const getIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />;
      case "image":
        return <Image className="h-8 w-8 text-blue-500" />;
      case "xlsx":
        return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
      case "docx":
        return <FileText className="h-8 w-8 text-blue-600" />;
      default:
        return <File className="h-8 w-8 text-gray-400" />;
    }
  };

  // 5. UI Helper: เลือกสีพื้นหลัง Icon ตามประเภทไฟล์
  const getBgColor = (type: string) => {
    switch (type) {
      case "pdf":
        return "bg-red-50 group-hover:bg-red-100";
      case "image":
        return "bg-blue-50 group-hover:bg-blue-100";
      case "xlsx":
        return "bg-green-50 group-hover:bg-green-100";
      default:
        return "bg-gray-50 group-hover:bg-gray-100";
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">
          Attachments{" "}
          <span className="ml-1 text-sm font-medium text-gray-400">
            ({documents.length})
          </span>
        </h3>
        {documents.length > 0 && (
          <button className="text-sm font-medium text-blue-600 hover:underline">
            Download All
          </button>
        )}
      </div>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-16">
          <div className="mb-3 rounded-full bg-white p-4 shadow-sm">
            <Paperclip className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="mb-1 font-bold text-gray-900">
            No documents attached
          </h4>
          <p className="text-sm text-gray-500">
            There are no files uploaded for this event.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="group flex h-full flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md"
            >
              {/* Header: Icon & Type Tag */}
              <div className="mb-3 flex items-start justify-between">
                <div
                  className={`rounded-lg p-2.5 transition-colors ${getBgColor(doc.type)}`}
                >
                  {getIcon(doc.type)}
                </div>
                <span className="rounded bg-gray-100 px-2 py-1 text-[10px] font-bold tracking-wide text-gray-400 uppercase">
                  {doc.type}
                </span>
              </div>

              {/* Body: Filename & Size */}
              <div className="mb-4">
                <h4
                  className="mb-1 truncate text-sm font-bold text-gray-900"
                  title={doc.name}
                >
                  {doc.name}
                </h4>
                <p className="text-xs font-medium text-gray-500">{doc.size}</p>
              </div>

              {/* Footer: Download Button */}
              <a
                href={doc.url}
                target="_blank" // เปิดแท็บใหม่ (ถ้าเป็นรูปหรือ pdf)
                rel="noreferrer"
                className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-gray-50 py-2 text-xs font-bold text-gray-600 transition-all group-hover:bg-blue-50 group-hover:text-blue-600 hover:bg-gray-900 hover:text-white"
              >
                <Download size={14} /> Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
