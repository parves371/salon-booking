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
  const [service, setService] = useState<ServiceProps | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams<Record<string, string>>();

  const ServiceSchema = z.object({
    service_name: z.string().min(1, {
      message: "Name is required",
    }),
    price: z
      .string()
      .refine((value) => !isNaN(Number(value)), {
        message: "Price must be a valid number",
      })
      .transform((value) => Number(value)),
    time: z.string().min(1, {
      message: "Time is required",
    }),
    option: z.boolean(),
    category_name: z.string().min(1, {
      message: "Category name is required",
    }),
  });
  

  const form = useForm<z.infer<typeof ServiceSchema>>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      service_name: "",
      price: 0,
      time: "",
      option: false,
      category_name: "",
    },
  });

  const fetchServiceById = async () => {
    try {
      const res = await axios.get(`/api/product/services/edit/${params.id}`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setService(res.data.data); // Assuming response contains `data` key with service details
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
    fetchCategories(); // Fetch categories on component mount
    if (params.id) {
      fetchServiceById();
    }
  }, [params.id]);

  useEffect(() => {
    if (service) {
      form.setValue("service_name", service.service_name);
      form.setValue("price", service.price);
      form.setValue("time", service.time);
      form.setValue("option", service.option ? true : false);
      form.setValue("category_name", service.category_name);
    }
  }, [service, form]);

  const onSubmit = async (data: z.infer<typeof ServiceSchema>) => {
    try {
      // Prepare the payload
      const payload = {
        service_name: data.service_name,
        price: data.price,
        time: data.time,
        option: data.option,
        category_id: categories.find((cat) => cat.name === data.category_name)?.id,
      };
  
      if (!payload.category_id) {
        toast({
          title: "Error",
          description: "Selected category is invalid.",
          variant: "destructive",
        });
        return;
      }
  
      // Make API call to update the service
      const response = await axios.put(`/api/product/services/edit/${params.id}`, payload, {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Service updated successfully.",
        });
        router.push("/admin/services"); 
      } else {
        throw new Error(response.data.message || "Failed to update service.");
      }
    } catch (error: any) {
      console.error("Error updating service:", error.response?.data || error.message);
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };
  

  const cancelButton = () => {
    router.push("/admin/services");
  };

  return (
    <div className="px-16">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/services">Services</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>Edit</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="p-6 max-w-2xl mx-auto border rounded-lg bg-white shadow mt-16">
        <h2 className="text-2xl font-bold mb-4">Edit Service</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <FormField
              name="service_name"
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
            {/* Price Field */}
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <input
                      type="number"
                      placeholder="Price"
                      className="border rounded-md px-3 py-2 w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Time Field */}
            <FormField
              name="time"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      placeholder="Duration (e.g., 30 minutes)"
                      className="border rounded-md px-3 py-2 w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Option Field */}
            <FormField
              name="option"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className={`${
                          field.value ? "bg-blue-600" : "bg-gray-200"
                        } relative inline-flex items-center h-6 rounded-full w-11`}
                      ></Switch>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Category Field */}
            <FormField
              name="category_name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="border rounded-md w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
