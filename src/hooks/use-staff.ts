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
//fetching data from the server | all the categories
export const useStaff = () => {
  return useQuery({
    queryKey: ["staff"], // A unique key for this query
    queryFn: fetchStaff, // The function to fetch data
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
