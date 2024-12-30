"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCategory, useDeleteCategory } from "@/hooks/product/use-catagory";
import { useDeleteStaff, useStaff } from "@/hooks/use-staff";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
interface StaffDetails {
  available: boolean;
  id: number;
  name: string;
  position: string;
  role: "superadmin" | "admin" | "manager" | "employee"; // Enum-like structure for roles
  skills: string | null; // Assuming skills could be a JSON string or null
}

const Page = () => {
  const router = useRouter();

  //fetching data from the server | all the Staff
  const { data, isLoading, isError, error } = useStaff();

  const deleteStaff = useDeleteStaff();

  const handleDelete = async (id: number) => {
    deleteStaff.mutate(id);
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/staff/edit/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderIcon className="size-5 spin-in-1" />
      </div>
    );
  }
  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="px-16">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/admin/staff">Staff</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between mt-8 items-center">
        <h2 className="text-3xl font-semibold">Staff</h2>
        <Button
          variant={"default"}
          onClick={() => router.push("/admin/staff/create")}
        >
          New Staff
        </Button>
      </div>

      <div className="mt-8">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Staf ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Position</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
              <th className="border border-gray-300 px-4 py-2">Available</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.data?.map((staff: StaffDetails) => (
              <tr key={staff.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {staff.id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {staff.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {staff.position}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {staff.role}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {staff.available ? "Yes" : "No"}{" "}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    className="text-blue-500"
                    onClick={() => handleEdit(staff.id)}
                  >
                    Edit
                  </Button>
                  <Dialog>
                    <DialogTrigger className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ">
                      Delete
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="py-4">
                          Are you absolutely sure?
                        </DialogTitle>

                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          onClick={() => handleDelete(staff.id)}
                        >
                          Confirm
                        </button>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
