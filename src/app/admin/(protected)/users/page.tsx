"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import moment from "moment";
import { useToast } from "@/hooks/use-toast";

export interface UserProps {
  id: string | number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}
const UsersPage = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get("/api/admin/user", { withCredentials: true });

      if (res.status === 200) {
        setUsers(res.data.allUsers);
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Bad Request",
        });
      } else {
        // Handle other errors
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "An unexpected error occurred.",
        });
      }
    }
  };

  const deleteUser = async (id: string) => {
    const response = await fetch(`/api/admin/delete-user?id=${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (response.ok) {
      toast({
        title: data.message,
      });
    } else {
      console.error(data.message);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const newUser = () => {
    router.push("/admin/users/create");
  };

  const onEdit = (user: UserProps) => {
    router.push(`/admin/users/edit/${user.id}`);
  };

  return (
    <div className="px-16">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/users">User</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>List</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between mt-8 items-center">
        <h2 className="text-3xl font-semibold">Users</h2>
        <Button variant={"default"} onClick={newUser}>
          new user
        </Button>
      </div>

      <div className="overflow-x-auto border rounded-lg p-4 mt-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Created</th>
              <th className="py-2 px-4 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50 transition duration-150"
              >
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4">
                  {moment(user.created_at).format("YYYY-MM-DD HH:mm:ss")}
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => onEdit(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={() => deleteUser(user?.id as string)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
