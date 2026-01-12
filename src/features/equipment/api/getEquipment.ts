import { queryOptions } from "@tanstack/react-query";
import type { EquipmentType } from "@/types/equipment";
import { filterFns } from "@tanstack/react-table";

const API_URL = import.meta.env.VITE_API_URL;

const getEquipment = async (params: { q?: string }): Promise<EquipmentType[]> => {
    const searchParams = new URLSearchParams();

    if (params.q) {
        searchParams.append("q", params.q);
    }
    const equipment = await fetch(`${API_URL}/api/equipments?${searchParams}`);
    if (!equipment.ok) {
        throw new Error("Failed to fetch equipment");
    }

    return equipment.json();
};

export const equipmentQuery = (filter:{q?:string}) => 
    queryOptions({
        queryKey: ["equipment","list", filter],
        queryFn: () => getEquipment(filter),
});