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

interface Service {
  id: number;
  category_name: string;
  service_name: string;
  time: string;
  price: string;
  option: boolean;
}
const UsersPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get("/api/product/services", {
        withCredentials: true,
      });
      setServices(res.data?.data || []);
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

  const editService = (id: number) => {
    router.push(`/admin/services/edit/${id}`);
  };
  const deleteService = async (id: number) => {
    try {
      await axios.delete(`/api/product/services/${id}`);
      setServices(services.filter((service) => service.id !== id));
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

  const newUser = () => {
    router.push("/admin/services/create");
  };

  return (
    <div className="px-16">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/services">services</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between mt-8 items-center">
        <h2 className="text-3xl font-semibold">services</h2>
        <Button variant={"default"} onClick={newUser}>
          new services
        </Button>
      </div>

      <div className="overflow-x-auto border rounded-lg p-4 mt-4">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Category Name</th>
              <th className="border px-4 py-2">service name</th>
              <th className="border px-4 py-2">Time</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Option</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{service.id}</td>
                <td className="border px-4 py-2">{service.category_name}</td>
                <td className="border px-4 py-2">{service.service_name}</td>
                <td className="border px-4 py-2">{service.time}</td>
                <td className="border px-4 py-2">${service.price}</td>
                <td className="border px-4 py-2">
                  {service.option ? "Yes" : "No"}
                </td>
                <td className="border px-4 py-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => editService(service.id)}
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
