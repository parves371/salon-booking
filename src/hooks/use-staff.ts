import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const fetchStaff = async (skills?: string[]) => {
  const url = skills
    ? `/api/staff?skills=${encodeURIComponent(skills.join(","))}`
    : "/api/staff";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch staff");
  }
  return response.json(); // Assuming the response is in JSON format
};
//fetching data from the server | all the Staff
export const useStaff = (skills?: string[]) => {
  return useQuery({
    queryKey: ["staff", skills], // A unique key for this query
    queryFn: () => fetchStaff(skills), // The function to fetch data
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
    queryKey: ["staff", staffId], // A unique key for this query
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
      skills: string[];
    }) => {
      console.log(data);
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
  skills: string;
}
export const useRenameStaff = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: Staff) => {
      const response = await axios.put(
        `/api/staff/edit/${payload.id}`,
        payload
      );
      if (response.status !== 200) {
        throw new Error("Failed to rename the staff");
      }
      return payload; // Return the payload to trigger updates with the new data
    },
    onSuccess: (data) => {
      // Optionally, refetch the individual staff data by ID
      queryClient.invalidateQueries({ queryKey: ["staff", data.id] });
      console.log(data.id);

      // Optionally, refetch the entire staff list
      queryClient.invalidateQueries({ queryKey: ["staff"] });

      // Toast notification for success
      toast({
        title: "Success",
        description: "Staff renamed successfully.",
      });
    },
    onError: (error) => {
      console.error("Error renaming staff:", error);
      toast({
        title: "Error",
        description: "Failed to rename the staff",
      });
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (staffId: number) => {
      const response = await axios.delete(`/api/staff/${staffId}`);
      if (response.status !== 200) {
        throw new Error("Failed to delete the Staff");
      }
      return staffId;
    },
    onSuccess: (staffId) => {
      // Optionally invalidate and refetch any queries if needed
      queryClient.invalidateQueries({
        queryKey: ["staff"],
      });
      // Local state update can also be handled here if using React Query everywhere
      toast({
        title: "Success",
        description: "Staff deleted successfully.",
      });
    },
    onError: (error) => {
      console.error("Error deleting Staff:", error);
      toast({
        title: "Error",
        description: "Failed to delete Staff.",
      });
    },
  });
};
