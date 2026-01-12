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
      staleTime: 1000 * 60 * 5,
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
      if (meta?.errorMessage) {
        toast.error(meta.errorMessage);
      }
    },
    onSettled: (_data, _error, _variables, _context, mutation) => {
      const meta = mutation.meta;
      if (meta?.invalidatesQuery) {
        queryClient.invalidateQueries({ queryKey: meta.invalidatesQuery });
      }
    },
  }),
});
