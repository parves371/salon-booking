import { useQuery } from "@tanstack/react-query";

const fetchServices = async () => {
  const response = await fetch("/api/product/services");
  if (!response.ok) {
    throw new Error("Failed to fetch options");
  }
  return response.json(); // Assuming the response is in JSON format
};

export const useServices = () => {
  return useQuery({
    queryKey: ["services"], // A unique key for this query
    queryFn: fetchServices, // The function to fetch data
    staleTime: 5 * 60 * 1000, // (Optional) Data remains fresh for 5 minutes
  });
};
