import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../use-toast";
import axios from "axios";

const fetchWorks = async () => {
  const response = await fetch("/api/product/bookings");
  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }
  return response.json(); // Assuming the response is in JSON format
};

export const useWorks = () => {
  return useQuery({
    queryKey: ["works"], // A unique key for this query
    queryFn: fetchWorks, // The function to fetch data
    staleTime: 5 * 60 * 1000, // (Optional) Data remains fresh for 5 minutes
  });
};

export const useDeleteBookings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (booking_id: number) => {
      const response = await axios.delete(`/api/product/bookings/`, {
        data: {
          booking_id: booking_id,
        },
      });
      if (response.status !== 200) {
        throw new Error("Failed to delete the bookings");
      }
      return booking_id;
    },
    onSuccess: (booking_id) => {
      // Optionally invalidate and refetch any queries if needed
      queryClient.invalidateQueries({
        queryKey: ["works"],
      });
      // Local state update can also be handled here if using React Query everywhere
      toast({
        title: "Success",
        description: "Bookings deleted successfully.",
      });
    },
    onError: (error) => {
      console.error("Error deleting bookings:", error);
      toast({
        title: "Error",
        description: "Failed to delete bookings.",
      });
    },
  });
};
