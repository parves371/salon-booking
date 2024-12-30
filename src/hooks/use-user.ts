import { useQuery } from "@tanstack/react-query";

// Fetch user data from the server | admin user
const fetchUser = async () => {
  const response = await fetch("/api/admin/user");
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
