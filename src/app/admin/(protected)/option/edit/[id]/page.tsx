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
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { set, z } from "zod";

interface Option {
  id: number; //
  name: string; //
  price: number; //
  service_id: number; //
  time: string; // Time required for the option
}

interface ServiceOption {
  category_name: string;
  id: number;
  option: number; // or boolean, depending on the context and usage
  price: string;
  service_name: string;
  time: string;
}

const ServicesEditedPage = () => {
  const [opton, setOpton] = useState<Option | null>(null);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams<Record<string, string>>();

  const OptionSchema = z.object({
    name: z.string().min(1, {
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
  });

  const form = useForm<z.infer<typeof OptionSchema>>({
    resolver: zodResolver(OptionSchema),
    defaultValues: {
      name: "",
      price: 0,
      time: "",
    },
  });

  const fetchOptionById = async () => {
    try {
      const res = await axios.get(`/api/product/options/edit/${params.id}`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setOpton(res.data.data);
      }
    } catch (error: any) {
      console.error(
        "Error fetching service:",
        error.response?.data || error.message
      );
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/product/services", {
        withCredentials: true,
      });

      if (res.status === 200) {
        setServices(res.data.data); // Assuming response contains `data` key with categories
      }
      setLoading(false);
    } catch (error: any) {
      console.error(
        "Error fetching categories:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    if (params.id) {
      fetchOptionById();
    }
  }, [params.id]);

  useEffect(() => {
    if (opton) {
      form.setValue("name", opton.name);
      form.setValue("price", opton.price);
      form.setValue("time", opton.time);
    }
  }, [opton, params.id]);

  const onSubmit = async (data: z.infer<typeof OptionSchema>) => {
    try {
      const payload = {
        price: data.price,
        time: data.time,
        name: data.name,
        services_id: services.find((opt) => opt.id === opton?.service_id)?.id,
      };

      if (!payload.services_id) {
        toast({
          title: "Error",
          description: "Selected Services is invalid.",
          variant: "destructive",
        });
        return;
      }

      const response = await axios.put(
        `/api/product/options/edit/${params.id}`,
        payload,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Service updated successfully.",
        });
        router.push("/admin/option");
      } else {
        throw new Error(response.data.message || "Failed to update service.");
      }
    } catch (error: any) {
      console.error(
        "Error updating service:",
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

  const cancelButton = () => {
    router.push("/admin/option");
  };

  if (loading) {
    return <div className="flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="px-16">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/option">Option</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>Edit</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="p-6 max-w-2xl mx-auto border rounded-lg bg-white shadow mt-16">
        <h2 className="text-2xl font-bold mb-4">Edit Option</h2>
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
                      placeholder="Option Name"
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
