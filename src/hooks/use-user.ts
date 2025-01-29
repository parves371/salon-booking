import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// Fetch user data from the server | admin user
const fetchAdminUser = async () => {
  const response = await fetch("/api/admin/profile");
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json(); // Assuming the response is in JSON format
};
//fetching data from the server | all the categories
export const useAdminUser = () => {
  return useQuery({
    queryKey: ["adminUser"], // A unique key for this query
    queryFn: fetchAdminUser, // The function to fetch data
    staleTime: 5 * 60 * 1000, // (Optional) Data remains fresh for 5 minutes
  });
};
const fetchUser = async () => {
  const response = await fetch("/api/profile");
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json(); // Assuming the response is in JSON format
};
//fetching data from the server | all the categories
export const useUser = () => {
  return useQuery({
    queryKey: ["user"], // A unique key for this query
    queryFn: fetchUser, // The function to fetch data
    staleTime: 5 * 60 * 1000, // (Optional) Data remains fresh for 5 minutes
  });
};
async function logoutUser(): Promise<void> {
  const response = await fetch("/api/logout", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Redirect to login after successful logout
      router.push("/");
      router.refresh();
      // Invalidate all queries after logout
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      // Optionally handle error
      console.error("Logout failed:", error.message);
    },
  });
}

const fetchAllUser = async () => {
  const response = await fetch("/api/admin/user");
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json(); // Assuming the response is in JSON format
};
//fetching data from the server | all the categories
export const useAllUser = () => {
  return useQuery({
    queryKey: ["user"], // A unique key for this query
    queryFn: fetchAllUser, // The function to fetch data
    staleTime: 5 * 60 * 1000, // (Optional) Data remains fresh for 5 minutes
  });
};

const fetchStaffByAdminUserId = async (id: number) => {
  const response = await fetch(`/api/staff/userId/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json(); // Assuming the response is in JSON format
};
//fetching data from the server | all the categories
export const useStaffByAdminUserId = (id: number) => {
  return useQuery({
    queryKey: ["adminStaffUser", id], // A unique key for this query
    queryFn: () => fetchStaffByAdminUserId(id), // The function to fetch data
    staleTime: 5 * 60 * 1000, // (Optional) Data remains fresh for 5 minutes
  });
};
