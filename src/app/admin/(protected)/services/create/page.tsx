"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Button } from "@/components/ui/button";
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

interface Category {
  id: string;
  name: string;
}
const page = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [category, setCategory] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const form = useForm<z.infer<typeof ServicesSchema>>({
    resolver: zodResolver(ServicesSchema),
    defaultValues: {
      name: "",
      price: "",
      time: "",
      Option: false,
    },
  });

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/product/category");

      // Handle successful response
      if (res.status === 200) {
        setCategory(res.data?.data);
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
    try {
      console.log(data);
      const res = await axios.post("/api/product/services", {
        ...data,
        categoryId: selectedCategoryId,
      });

      // Handle successful response
      if (res.status === 200) {
        toast({
          title: "User created successfully!",
        });
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

  const handleSelectChange = (value: string) => {
    // Assuming the value is the category id, we can parse it to a number
    setSelectedCategoryId(parseInt(value));
  };
  const cancelButton = () => {
    router.push("/admin/services");
  };
  return (
    <div className="px-16">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/services">services</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>Create</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-16 max-w-[1000px] w-full mx-auto">
        <CardHeader>
          <CardTitle>Add services</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedCategoryId?.toString()}
            onValueChange={handleSelectChange}
          >
            <span className="block my-2 text-xl font-semibold">
              Selected Category
            </span>
            <SelectTrigger className="w-[180px] my-4">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {category.map((cat) => (
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
              <FormField
                name="Option"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Option</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      value={field.value ? "true" : "false"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">true</SelectItem>
                        <SelectItem value="false">false</SelectItem>
                      </SelectContent>
                    </Select>
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
              </div>
            </form>
          </Form>
        </CardContent>

        <CardFooter>
          <button
            type="button"
            className="text-gray-500 px-4 py-2 rounded-md hover:bg-gray-200"
            onClick={cancelButton}
          >
            Cancel
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
