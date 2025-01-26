"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

import { useToast } from "@/hooks/use-toast";
import { ServicesSchema } from "@/schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";

interface services {
  category_id: number;
  id: number;
  name: string;
  option: number;
  price: string;
  time: string;
}
const page = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [services, setServices] = useState<services[]>([]);
  const [selectedServicesId, setSelectedServicesId] = useState<number | null>(
    null
  );

  const form = useForm<z.infer<typeof ServicesSchema>>({
    resolver: zodResolver(ServicesSchema),
    defaultValues: {
      name: "",
      price: "",
      time: "",
    },
  });

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/product/services/data");

      console.log(res.data.data);

      // Handle successful response
      if (res.status === 200) {
        setServices(res.data?.data);
      }
    } catch (error: any) {
      // Handle 400 error specifically
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

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data: z.infer<typeof ServicesSchema>) => {
    const formData = {
      ...data,
      serviceId: selectedServicesId,
    };
    try {
      const res = await axios.post("/api/product/options", formData);
      if (res.status === 200) {
        toast({
          title: "Options created successfully!",
        });
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Bad Request",
        });
      } else {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "An unexpected error occurred.",
        });
      }
    }
  };

  const handleSelectChange = (value: string) => {
    setSelectedServicesId(parseInt(value));
  };
  const cancelButton = () => {
    router.push("/admin/option");
  };
  return (
    <div className="px-16">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/admin/option">Options</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>Create</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-16 max-w-[1000px] w-full mx-auto">
        <CardHeader>
          <CardTitle>Add Options</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedServicesId?.toString()}
            onValueChange={handleSelectChange}
          >
            <span className="block my-2 text-xl font-semibold">
              Selected Services
            </span>
            <SelectTrigger className="w-[180px] my-4">
              <SelectValue placeholder="Select Services" />
            </SelectTrigger>
            <SelectContent>
              {services.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>name</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="border rounded-md px-3 py-2 w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="time"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>time</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        placeholder="enter time"
                        className="border rounded-md px-3 py-2 w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="price"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>price</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        placeholder="enter price"
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
                <Button
                  variant={"default"}
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                >
                  add
                </Button>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
