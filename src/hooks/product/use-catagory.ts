import { useQuery } from "@tanstack/react-query";

const fetchCategory = async () => {
  const response = await fetch("/api/product/category");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json(); // Assuming the response is in JSON format
};

export const useCategory = () => {
  return useQuery({
    queryKey: ["category"], // A unique key for this query
    queryFn: fetchCategory, // The function to fetch data
    staleTime: 5 * 60 * 1000, // (Optional) Data remains fresh for 5 minutes
  });
};
