import { useQuery } from "@tanstack/react-query";

const fetchOption = async () => {
  const response = await fetch("/api/product/options");
  if (!response.ok) {
    throw new Error("Failed to fetch options");
  }
  return response.json(); // Assuming the response is in JSON format
};

export const useOption = () => {
  return useQuery({
    queryKey: ["option"], // A unique key for this query
    queryFn: fetchOption, // The function to fetch data
    staleTime: 5 * 60 * 1000, // (Optional) Data remains fresh for 5 minutes
  });
};
