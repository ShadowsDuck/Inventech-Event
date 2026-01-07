import { queryOptions } from "@tanstack/react-query";
const getCategory = async () => {
    const equipment = await fetch("https://localhost:7268/api/Category");
    return equipment.json();
}

export const categoryQuery = queryOptions({
    queryKey: ["category"],
    queryFn: getCategory,
});