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
import { useToast } from "@/hooks/use-toast";
import { CategorySchema } from "@/schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CategoryAdd = () => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmitCategory = async (data: z.infer<typeof CategorySchema>) => {
    try {
      const res = await axios.post("/api/product/category", data, {
        withCredentials: true,
      });

      toast({
        title: "Category created successfully!",
      });
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

  const cancelButton = () => {
    router.push("/admin/category");
  };
  return (
    <div className="px-16">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/admin/category">category</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>Create</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-16 max-w-[1000px] w-full mx-auto">
        <CardHeader>
          <CardTitle>Add Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitCategory)}
              className="space-y-6"
            >
              {/* Name Field */}
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

export default CategoryAdd;
