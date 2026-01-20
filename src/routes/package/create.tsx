import { createFileRoute } from "@tanstack/react-router";

import { packageQuerys } from "@/features/package/api/getPackage";
import CreatePackage from "@/features/package/components/CreatePackage";

export const Route = createFileRoute("/package/create")({
  component: CreatePackage,
  staticData: {
    title: "Create Package",
  },

  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(packageQuerys());
  },
});
