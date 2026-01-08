import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export const deleteCompany = async (companyId: number): Promise<void> => {
  const res = await fetch(`${API_URL}/api/Company/${companyId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete company");
  }
  return;
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: (_, companyId) => {
      queryClient.invalidateQueries({ queryKey: ["companies", "list"] });
      queryClient.removeQueries({
        queryKey: ["companies", "detail", companyId],
      });
    },
  });
};
