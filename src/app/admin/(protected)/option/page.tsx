"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useOption } from "@/hooks/product/use-options";
import { LoaderIcon } from "lucide-react";

interface OptionDetails {
  id: number; // Option ID
  option_name: string; // Name of the option
  option_price: string; // Price of the option as a string
  option_time: string; // Time required for the option
  service_name: string; // Associated service name
  category_name: string; // Associated category name
}

const UsersPage = () => {
  const [option, setOption] = useState<OptionDetails[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  // Fetching data from the server | all the options
  const { data, isLoading, isError, error } = useOption();

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get("/api/product/options", {
        withCredentials: true,
      });
      setOption(res.data?.data || []);
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

  const editOption = (id: number) => {
    router.push(`/admin/option/edit/${id}`);
  };
  const deleteService = async (id: number) => {
    try {
      await axios.delete(`/api/product/options/${id}`);
      setOption(option.filter((service) => service.id !== id));
      toast({
        title: "Service deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const newOption = () => {
    router.push("/admin/option/create");
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
            <BreadcrumbLink href="/admin/option">Options</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between mt-8 items-center">
        <h2 className="text-3xl font-semibold">Options</h2>
        <Button variant={"default"} onClick={newOption}>
          new Option
        </Button>
      </div>

      <div className="overflow-x-auto border rounded-lg p-4 mt-4">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Category Name</th>
              <th className="border px-4 py-2">service name</th>
              <th className="border px-4 py-2">option name</th>
              <th className="border px-4 py-2">Time</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.data?.map((service:OptionDetails) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{service.id}</td>
                <td className="border px-4 py-2">{service.category_name}</td>
                <td className="border px-4 py-2">{service.service_name}</td>
                <td className="border px-4 py-2">{service.option_name}</td>
                <td className="border px-4 py-2">{service.option_time}</td>
                <td className="border px-4 py-2">${service.option_price}</td>

                <td className="border px-4 py-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => editOption(service.id)}
                  >
                    Edit
                  </button>

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
                          onClick={() => deleteService(service.id)}
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

export default UsersPage;
