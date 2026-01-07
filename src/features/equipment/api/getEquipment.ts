import { queryOptions } from "@tanstack/react-query";
const getEquipment = async () => {
    const equipment = await fetch("https://localhost:7268/api/Equipment");
    return equipment.json();
}

export const equipmentQuery = queryOptions({
    queryKey: ["equipment"],
    queryFn: getEquipment,
});