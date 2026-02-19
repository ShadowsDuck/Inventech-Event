import { type ExternalToast, toast as sonnerToast } from "sonner";

const TOAST_POSITION = "bottom-right";

// Style สำหรับ Success
const successStyle: React.CSSProperties = {
  "--normal-bg": "var(--background)",
  "--normal-text": "light-dark(var(--color-green-600), var(--color-green-400))",
  "--normal-border":
    "light-dark(var(--color-green-600), var(--color-green-400))",
} as React.CSSProperties;

// Style สำหรับ Error
const errorStyle: React.CSSProperties = {
  "--normal-bg": "var(--background)",
  "--normal-text": "var(--destructive)",
  "--normal-border": "var(--destructive)",
} as React.CSSProperties;

export const toast = {
  ...sonnerToast,

  success: (message: string, options?: ExternalToast) => {
    return sonnerToast.success(message, {
      position: TOAST_POSITION,
      style: successStyle,
      ...options,
    });
  },

  error: (message: string, options?: ExternalToast) => {
    return sonnerToast.error(message, {
      position: TOAST_POSITION,
      style: errorStyle,
      ...options,
    });
  },
};
