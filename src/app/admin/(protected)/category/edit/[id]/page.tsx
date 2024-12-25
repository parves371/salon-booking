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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

interface ServiceProps {
  id: number;
  service_name: string;
  price: number;
  time: string;
  option: boolean;
  category_name: string;
}

interface Category {
  id: number;
  name: string;
}

const ServicesEditedPage = () => {
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams<Record<string, string>>();

  const ServiceSchema = z.object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
  });

  const form = useForm<z.infer<typeof ServiceSchema>>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      name: "",
    },
  });

  const fetchServiceById = async () => {
    try {
      const res = await axios.get(`/api/product/category/edit/${params.id}`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setCategory(res.data.data); // Assuming response contains `data` key with service details
      }
    } catch (error: any) {
      console.error(
        "Error fetching service:",
        error.response?.data || error.message
      );
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/product/category", {
        withCredentials: true,
      });

      if (res.status === 200) {
        setCategories(res.data.data); // Assuming response contains `data` key with categories
      }
    } catch (error: any) {
      console.error(
        "Error fetching categories:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchCategories();
    if (params.id) {
      fetchServiceById();
    }
  }, [params.id]);

  const onSubmit = async (data: z.infer<typeof ServiceSchema>) => {
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
    if (category) {
      form.setValue("name", category.name);
    }
  }, [category, params.id]);

  const cancelButton = () => {
    router.push("/admin/services");
  };

  return (
    <div className="px-16">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/category">Category</BreadcrumbLink>
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

export default ServicesEditedPage;
