import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const fetchCategory = async () => {
  const response = await fetch("/api/product/category");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json(); // Assuming the response is in JSON format
};
//fetching data from the server | all the categories
export const useCategory = () => {
  return useQuery({
    queryKey: ["category"], // A unique key for this query
    queryFn: fetchCategory, // The function to fetch data
    staleTime: 5 * 60 * 1000, // (Optional) Data remains fresh for 5 minutes
  });
};

const fetchCategoryById = async (id: number) => {
  const response = await fetch(`/api/product/category/edit/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json(); // Assuming the response is in JSON format
};
// Fetching data from the server | category by id
export const useCategoryById = (categoryId: number) => {
  return useQuery({
    queryKey: ["category", categoryId], // A unique key for this query
    queryFn: () => fetchCategoryById(categoryId), // The function to fetch data
    staleTime: 5 * 60 * 1000, // (Optional) Data remains fresh for 5 minutes
  });
};
// delete category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (categoryId: number) => {
      const response = await axios.delete(
        `/api/product/category/${categoryId}`
      );
      if (response.status !== 200) {
        throw new Error("Failed to delete the category");
      }
      return categoryId;
    },
    onSuccess: (categoryId) => {
      // Optionally invalidate and refetch any queries if needed
      queryClient.invalidateQueries({
        queryKey: ["category"],
      });
      // Local state update can also be handled here if using React Query everywhere
      toast({
        title: "Success",
        description: "Category deleted successfully.",
      });
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category.",
      });
    },
  });
};
