"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const page = () => {
    const router = useRouter();
  const users = [
    {
      name: "Esmail Khalifa",
      email: "esmailkhalifa010@gmail.com",
      role: "manager",
      created: "Oct 29, 2024",
    },
    {
      name: "Maahi",
      email: "landingbuz@gmail.com",
      role: "manager",
      created: "Dec 9, 2024",
    },
  ];

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
                <td className="py-2 px-4">{user.created}</td>
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

export default page;
