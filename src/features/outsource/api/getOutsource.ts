import { queryOptions } from "@tanstack/react-query";
import type { OutsourceType } from "@/types/outsource";

const API_URL = import.meta.env.VITE_API_URL;
const getOutsource = async (params: { q?: string }): Promise<OutsourceType[]> => {
    const searchParams = new URLSearchParams();

    if (params.q) {
        searchParams.append("q", params.q);
    }
    const query = searchParams.toString();

    const res = await fetch(`${API_URL}/api/Outsource${query ? `?${query}` : ""}`);

    if (!res.ok) {
        throw new Error("Failed to fetch outsource");
    }
    return res.json();
}
export const outsourceQuery = (filters: { q?: string }) =>
    queryOptions({
        queryKey: ["outsource", "list", filters],
        queryFn: () => getOutsource(filters),
});