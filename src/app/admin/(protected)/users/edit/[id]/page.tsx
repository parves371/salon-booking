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
import Link from "next/link";
interface UserProps {
  id: number;
  email: string;
  name: string;
  role: "superadmin" | "admin" | "manager" | "employee" | undefined; // Make role optional
  created_at: string;
}

const UserEditedPage = () => {
  const [user, setUser] = useState<UserProps>();

  const { toast } = useToast();
  const router = useRouter();
  const params = useParams<Record<string, string>>();

  console.log("username", user?.name);
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
    role: z.enum(["superadmin", "admin", "manager", "employee"], {
      errorMap: () => ({ message: "Invalid role selected" }),
    }),
  });

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: undefined, // Allow undefined initially for role
    },
  });
  const onSubmit = async (data: z.infer<typeof UserSchema>) => {
    try {
      console.log("Submitting data:", data); // Debug log for payload

      const res = await axios.post("/api/admin/user", data, {
        withCredentials: true, // Ensure cookies are sent
      });

      // Handle successful response
      if (res.status === 201) {
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

  const fetchAllUsers = async () => {
    try {
      const res = await axios.post(
        `/api/admin/edit`,
        {
          id: params.id,
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setUser(res?.data?.user);
      }
    } catch (error: any) {
      console.error(
        "Error fetching users:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchAllUsers();
    }
  }, [params.id]);

  useEffect(() => {
    if (user) {
      form.setValue("name", user.name ?? "");
      form.setValue("email", user.email ?? "");
      form.setValue("password", ""); // Empty password by default
      form.setValue("role", user.role ?? "employee"); // Default to "Employee" if role is undefined
    }
  }, [user, form]);
  console.log(user);

  const cancelButton = () => {
    router.push("/admin/users");
  };

  return (
    <div className="px-16">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/admin/users">User</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>Edit</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="p-6 max-w-2xl mx-auto border rounded-lg bg-white shadow mt-16">
        <h2 className="text-2xl font-bold mb-4">Edit User</h2>
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
                      autoComplete="current-password"
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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Ensure the values here match your role values exactly */}
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
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

export default UserEditedPage;
