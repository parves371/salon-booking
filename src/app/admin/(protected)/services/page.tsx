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

interface Service {
  id: number;
  category_id: number;
  name: string;
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
    window.location.href = `/services/edit/${id}`;
  };
  const deleteService = async (id: number) => {
    try {
      await axios.delete(`/api/services/${id}`);
      setServices(services.filter((service) => service.id !== id)); // Update state
      alert("Service deleted successfully");
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

  const onEdit = (user: Service) => {
    router.push(`/admin/services/edit/${user.id}`);
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
        <h2 className="text-3xl font-semibold">Category</h2>
        <Button variant={"default"} onClick={newUser}>
          new Category
        </Button>
      </div>

      <div className="overflow-x-auto border rounded-lg p-4 mt-4">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Category ID</th>
              <th className="border px-4 py-2">Name</th>
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
                <td className="border px-4 py-2">{service.category_id}</td>
                <td className="border px-4 py-2">{service.name}</td>
                <td className="border px-4 py-2">{service.time}</td>
                <td className="border px-4 py-2">{service.price}</td>
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
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => deleteService(service.id)}
                  >
                    Delete
                  </button>
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
