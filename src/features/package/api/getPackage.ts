import { queryOptions } from "@tanstack/react-query";

const getPackage = async () => { 
    const pack = await fetch("https://localhost:7268/api/packages");
    return pack.json();
}

export const packageQueryOptions = queryOptions({
    queryKey: ["package"],
    queryFn: getPackage
});