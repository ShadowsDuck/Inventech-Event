import { useMutation } from "@tanstack/react-query";

import type { OutsourceData } from "../components/outsource-form";

const API_URL = import.meta.env.VITE_API_URL;

type UpdateOutsourceData = OutsourceData & {
  id: string;
  outsourceId: number;
};

const updateOutsource = async ({
  id,
  ...data
}: UpdateOutsourceData): Promise<void> => {
  await fetch(`${API_URL}/api/outsources/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return;
};

export const useUpdateOutsource = () =>
  useMutation({
    mutationFn: updateOutsource,
    meta: {
      invalidatesQuery: ["outsources"],
      successMessage: "Updated outsource successfully",
      errorMessage: "Failed to update outsource",
    },
  });
