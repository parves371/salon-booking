import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Function to fetch available slots for a staff member on a specific date
const fetchSlots = async (
  staffId: number[],
  date: string,
  services: { id: number; time: string }[]
): Promise<string[]> => {
  const response = await fetch(`/api/product/slots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ date, staffIds: staffId, services }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch slots: ${response.statusText}`);
  }

  const data = await response.json();
  return data.availableSlots;
};

// React Query hook to fetch available slots for a specific staff member and date
export const useSlots = (
  staffIds: number[],
  date: string,
  services: { id: number; time: string }[]
) => {
  return useQuery({
    queryKey: ["slots", staffIds, date], // Unique key for the query
    queryFn: () => fetchSlots(staffIds, date, services), // Function to fetch data
    staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
    enabled: !!staffIds && !!date, // Ensures the query runs only when staffId and date are provided
  });
};

// Function to book a slot
interface BookingDetail {
  staffId: number;
  startTime: string;
  endTime: string;
  serviceId: number;
  price: string;
}

const bookings = async (
  bookingDetails: BookingDetail[],
  userId: number,
  totalprice: number
): Promise<void> => {
  const response = await fetch("/api/product/bookings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      services:bookingDetails,
      customerId: userId,
      totalprice,

    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to book slot");
  }
};

// React Query mutation hook for booking a slot
export const useBookings = (
  services: {
    id: number;
    staffId: number;
    startTime: string;
    endTime: string;
    serviceId: number;
    price: string;
  }[],
  userId: number
) => {
  const queryClient = useQueryClient();

  // Calculate total price from the services array
  const totalprice = services.reduce(
    (sum, service) => sum + parseFloat(service.price),
    0
  );

  return useMutation({
    mutationFn: () => bookings(services, userId, totalprice),
    onSuccess: () => {
      // Invalidate the slots query to fetch updated data
      queryClient.invalidateQueries({
        queryKey: ["slots"],
      });
    },
    onError: (error: any) => {
      // Handle error, e.g., show a toast notification
      console.error("Error booking slot:", error.message || "Unknown error");
    },
  });
};

