import {
  MutationCache,
  QueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { toast } from "sonner";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidatesQuery?: QueryKey;
      successMessage?: string;
      errorMessage?: string;
    };
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },

  // Global Mutation Settings
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      const meta = mutation.meta;
      if (meta?.successMessage) {
        toast.success(meta.successMessage);
      }
    },
    onError: (error, _variables, _context, mutation) => {
      const meta = mutation.meta;
      const message =
        error.message || meta?.errorMessage || "An error occurred";
      toast.error(message);
    },
    onSettled: async (_data, _error, _variables, _context, mutation) => {
      const meta = mutation.meta;
      const queryKey = meta?.invalidatesQuery;

      if (queryKey) {
        // เช็คว่าส่งมาเป็น Array ของ Key (เช่น [["a"], ["b"]]) หรือแค่ Key เดียว (เช่น ["a"])
        const isMultiKey = Array.isArray(queryKey[0]);
        const keysToRefetch = isMultiKey
          ? (queryKey as QueryKey[])
          : [queryKey as QueryKey];

        // ใช้ refetchQueries และ await เพื่อให้โหลด "ของใหม่" ให้เสร็จก่อน
        // Promise.all จะช่วยให้โหลดทุก Key พร้อมกัน ไม่ต้องรอทีละตัว
        await Promise.all(
          keysToRefetch.map((key) =>
            queryClient.refetchQueries({ queryKey: key }),
          ),
        );
      }
    },
  }),
});
