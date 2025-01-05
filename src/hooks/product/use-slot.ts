import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Function to fetch available slots for a staff member on a specific date
const fetchSlots = async (staffId: number, date: string): Promise<string[]> => {
  const response = await fetch(`/api/product/slots/${staffId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ date }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch slots: ${response.statusText}`);
  }

  const data = await response.json();
  return data.availableSlots;
};

// React Query hook to fetch available slots for a specific staff member and date
export const useSlots = (staffId: number, date: string) => {
  return useQuery({
    queryKey: ["slots", staffId, date], // Unique key for the query
    queryFn: () => fetchSlots(staffId, date), // Function to fetch data
    staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
    enabled: !!staffId && !!date, // Ensures the query runs only when staffId and date are provided
  });
};

// Function to book a slot
const bookSlot = async (bookingDetails: {
  staffId: number;
  userId: number;
  startTime: string;
  endTime: string;
}): Promise<void> => {
  const response = await fetch("/api/product/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingDetails),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to book slot");
  }
};

// React Query mutation hook for booking a slot
export const useBookSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookSlot, // Function to book a slot
    onSuccess: () => {
      // Invalidate the slots query to fetch updated data
      queryClient.invalidateQueries({
        queryKey: ["slots"],
      });
    },
    onError: (error: any) => {
      // Handle error, e.g., show a toast notification
      console.error("Error booking slot:", error);
    },
  });
};
