import { queryOptions } from "@tanstack/react-query";

const getOutsource = async () => { 
    const outsource = await fetch("https://localhost:7268/api/Outsource");
    return outsource.json();
}
export const outsourceQuery = queryOptions({
    queryKey: ["outsource"],
    queryFn: getOutsource,
});