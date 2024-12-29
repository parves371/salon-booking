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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { LoaderIcon } from "lucide-react";
import { useCategory } from "@/hooks/product/use-catagory";

interface Category {
  id: number;
  name: string;
}

const Page = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();

  //fetching data from the server | all the categories
  const { data, isLoading, isError, error } = useCategory();

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/product/category/${id}`);
      setCategories(categories.filter((service) => service.id !== id));
      toast({
        title: "Category deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/category/edit/${id}`);
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
            <BreadcrumbLink href="/admin/category">Category</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between mt-8 items-center">
        <h2 className="text-3xl font-semibold">Category</h2>
        <Button
          variant={"default"}
          onClick={() => router.push("/admin/category/create")}
        >
          New Category
        </Button>
      </div>

      <div className="mt-8">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.data?.map((category: Category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {category.id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {category.name}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    className="text-blue-500"
                    onClick={() => handleEdit(category.id)}
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
                          onClick={() => handleDelete(category.id)}
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
