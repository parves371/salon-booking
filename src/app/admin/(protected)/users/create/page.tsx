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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const UserCreatedPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const UserSchema = z.object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z.string().min(1, {
      message: "Password is required",
    }),
    role: z.string().min(1, {
      message: "Role is required",
    }),
  });

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof UserSchema>) => {
    try {
      console.log("Submitting data:", data); // Log the form data
      const res = await axios.post("/api/admin/user", data);
  
      if (res.status === 201) {
        toast({
          title: "User created successfully!",
        });
      } else {
        console.log(res);
        toast({
          title: res.data.message || "Unexpected error occurred.",
        });
      }
    } catch (error: any) {
      toast({
        title:
          error.response?.data?.message ||
          "An error occurred while creating the user.",
      });
    }
  };
  

  const cancelButton = () => {
    router.push("/admin/users");
  };

  return (
    <div className="px-16">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/users">User</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>Create</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="p-6 max-w-2xl mx-auto border rounded-lg bg-white shadow mt-16">
        <h2 className="text-2xl font-bold mb-4">Create User</h2>
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
                      placeholder="John Doe"
                      className="border rounded-md px-3 py-2 w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <input
                      type="email"
                      placeholder="john.doe@example.com"
                      className="border rounded-md px-3 py-2 w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <input
                      type="password"
                      placeholder="Your password"
                      className="border rounded-md px-3 py-2 w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Field */}
            <FormField
              name="role"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SuperAdmin">Super Admin</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
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
                Create
              </button>
              <button
                type="button"
                className="border px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Create & Create Another
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

export default UserCreatedPage;