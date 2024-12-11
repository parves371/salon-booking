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

interface UserProps {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}
const UsersPage = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const router = useRouter();

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get("/api/admin/user", { withCredentials: true });

      if (res.status === 200) {
        setUsers(res.data.allUsers);
      }
    } catch (error: any) {
      console.error(
        "Error fetching users:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const newUser = () => {
    router.push("/admin/users/create");
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
        <Button variant={"coustom"} onClick={newUser}>
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
                <td className="py-2 px-4">{moment(user.created_at).format("YYYY-MM-DD HH:mm:ss")}</td>
                <td className="py-2 px-4 flex gap-2">
                  <Button variant="outline" size="lg">
                    Edit
                  </Button>
                  <Button variant="destructive" size="lg">
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
