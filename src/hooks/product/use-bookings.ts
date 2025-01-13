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
    queryKey: ["bookings"], // A unique key for this query
    queryFn: fetchWorks, // The function to fetch data
    staleTime: 5 * 60 * 1000, // (Optional) Data remains fresh for 5 minutes
  });
};
const fetchBookingsById = async (id: number) => {
  const response = await fetch(`/api/product/bookings/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch staff");
  }
  return response.json(); // Assuming the response is in JSON format
};
export const useBookingsById = (bookingsId: number) => {
  return useQuery({
    queryKey: ["bookings", bookingsId], // A unique key for this query
    queryFn: () => fetchBookingsById(bookingsId), // The function to fetch data
    staleTime: 5 * 60 * 1000, // (Optional) Data remains fresh for 5 minutes
  });
};
export const useDeleteBookings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (booking_id: number) => {
      const response = await axios.delete(
        `/api/product/bookings/${booking_id}`
      );
      if (response.status !== 200) {
        throw new Error("Failed to delete the bookings");
      }
      return booking_id;
    },
    onSuccess: (booking_id) => {
      // Optionally invalidate and refetch any queries if needed
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
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

export const useRenameBookings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (bookings: { id: number; status: string }) => {
      try {
        // Use fetch to send the DELETE request
        const response = await fetch(
          `/api/product/bookings/edit/${bookings.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: bookings.status,
            }),
          }
        );

        // Check if the response status is not 200
        if (!response.ok) {
          throw new Error("Failed to Rename bookings");
        }

        return response.json(); // Return the response data
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Failed to Rename booking"
        );
      }
    },
    onSuccess: (booking_id) => {
      // Invalidate and refetch the bookings list
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });

      // Show success toast
      toast({
        title: "Success",
        description: "Booking Rename successfully.",
      });
    },
    onError: (error: Error) => {
      console.error("Error Renaming booking:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to Rename booking.",
      });
    },
  });
};
