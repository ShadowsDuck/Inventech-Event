import { queryOptions } from "@tanstack/react-query";

const getStaff = async () => {
  const staff = await fetch("https://localhost:7268/api/Staff");
  return staff.json();
}

export const staffQuery = queryOptions({
  queryKey: ["staff"],
  queryFn: getStaff,
});