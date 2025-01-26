"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useCategoryById,
  useDeleteCategory,
} from "@/hooks/product/use-catagory";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Category {
  id: number;
  name: string;
}

const CategoryEditedPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams<Record<string, string>>();

  // Fetching data from the server | category by id
  const { data, error, isLoading, isError } = useCategoryById(
    params.id ? parseInt(params.id) : 0
  );


  const CategorySchema = z.object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
  });

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof CategorySchema>) => {
    try {
      const payload = {
        name: data.name,
      };

      const response = await axios.put(
        `/api/product/category/edit/${params.id}`,
        payload,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Category updated successfully.",
        });
        router.push("/admin/category");
      } else {
        throw new Error(response.data.message || "Failed to update Category.");
      }
    } catch (error: any) {
      console.error(
        "Error updating Category:",
        error.response?.data || error.message
      );
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (data?.data) {
      form.setValue("name", data?.data?.name);
    }
  }, [data?.data, params.id]);

  const cancelButton = () => {
    router.push("/admin/category");
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
            <Link href="/admin/category">Category</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>Edit</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="p-6 max-w-2xl mx-auto border rounded-lg bg-white shadow mt-16">
        <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      placeholder="Service Name"
                      className="border rounded-md px-3 py-2 w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
              >
                Save
              </button>
              <button
                type="button"
                className="text-gray-500 px-4 py-2 rounded-md hover:bg-gray-200"
                onClick={cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CategoryEditedPage;
