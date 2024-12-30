import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const fetchStaff = async () => {
  const response = await fetch("/api/staff");
  if (!response.ok) {
    throw new Error("Failed to fetch staff");
  }
  return response.json(); // Assuming the response is in JSON format
};
//fetching data from the server | all the Staff
export const useStaff = () => {
  return useQuery({
    queryKey: ["staff"], // A unique key for this query
    queryFn: fetchStaff, // The function to fetch data
    staleTime: 5 * 60 * 1000, // (Optional) Data remains fresh for 5 minutes
  });
};
const fetchStaffById = async (id: number) => {
  const response = await fetch(`/api/staff/edit/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch staff");
  }
  return response.json(); // Assuming the response is in JSON format
};
// Fetching data from the server | Staff by id
export const useStaffById = (staffId: number) => {
  return useQuery({
    queryKey: ["category", staffId], // A unique key for this query
    queryFn: () => fetchStaffById(staffId), // The function to fetch data
    staleTime: 5 * 60 * 1000, // (Optional) Data remains fresh for 5 minutes
  });
};

export const useAddStaff = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      position: string;
      available: boolean;
      userId: number | null;
    }) => {
      const response = await axios.post(`/api/staff`, data);
      if (response.status !== 201) {
        throw new Error("Failed to creating staff");
      }
      return response.data;
    },

    onSuccess: () => {
      // Optionally invalidate and refetch any queries if needed
      queryClient.invalidateQueries({
        queryKey: ["staff"],
      });
      // Local state update can also be handled here if using React Query everywhere
      toast({
        title: "Success",
        description: "Staff creating successfully!",
      });
    },
    onError: (error) => {
      console.error("Error creating staff:", error);
      toast({
        title: "Error",
        description: "Failed create staff.",
      });
    },
  });
};

interface Staff {
  id: number;
  position: string;
  available: boolean;
  userId: number;
}
export const useRenameStaff = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (paload: Staff) => {
      const response = await axios.put(`/api/staff/edit/${paload.id}`, paload);
      if (response.status !== 200) {
        throw new Error("Failed to rename the staff");
      }
      return;
    },
    onSuccess: () => {
      // Optionally invalidate and refetch any queries if needed
      queryClient.invalidateQueries({
        queryKey: ["staff"],
      });
      // Local state update can also be handled here if using React Query everywhere
      toast({
        title: "Success",
        description: "rename the staff successfully.",
      });
    },
    onError: (error) => {
      console.error("Error deleting staff:", error);
      toast({
        title: "Error",
        description: "Failed to rename the staff",
      });
    },
  });
};

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
