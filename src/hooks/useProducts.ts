import { useQuery } from "@tanstack/react-query";

const fetchProduct = async () => {
  const response = await fetch("/api/product/categories");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json(); // Assuming the response is in JSON format
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["product"], // A unique key for this query
    queryFn: fetchProduct, // The function to fetch data
    staleTime: 5 * 60 * 1000, // (Optional) Data remains fresh for 5 minutes
  });
};
