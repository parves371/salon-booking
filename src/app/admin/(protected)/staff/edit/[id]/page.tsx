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
import { Switch } from "@/components/ui/switch";
import { useRenameStaff, useStaffById } from "@/hooks/use-staff";
import { useUser } from "@/hooks/use-user";
import { StaffSchema } from "@/schemas/staff";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
interface UserAdminProps {
  id: number;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "manager" | "employee";
  created_at: string; // ISO string format for dates
}

const StaffEditedPage = () => {
  const router = useRouter();
  const params = useParams<Record<string, string>>();

  // Fetching data from the server | category by id
  const {
    data: staff,
    error,
    isLoading,
    isError,
  } = useStaffById(params.id ? parseInt(params.id) : 0);

  const { data: adminUserData } = useUser();
  const renameStaff = useRenameStaff();

  const form = useForm<z.infer<typeof StaffSchema>>({
    resolver: zodResolver(StaffSchema),
    defaultValues: {
      position: "",
      available: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof StaffSchema>) => {
    const payload = {
      id: params.id ? parseInt(params.id) : 0,
      position: data.position,
      available: data.available,
      userId: adminUserData?.allUsers?.find(
        (user: UserAdminProps) => user.name === staff?.data?.name
      )?.id,
    };

    renameStaff.mutate(payload);
    router.push("/admin/staff");
  };

  useEffect(() => {
    if (staff?.data) {
      form.setValue("available", staff?.data.available ? true : false);
      form.setValue("position", staff?.data.position);
    }
  }, [staff?.data, form]);

  const cancelButton = () => {
    router.push("/admin/staff");
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
            <BreadcrumbLink href="/admin/category">staff</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>Edit</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="p-6 max-w-2xl mx-auto border rounded-lg bg-white shadow mt-16">
        <h2 className="text-2xl font-bold mb-4">Edit staff</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <FormField
              name="position"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Positon</FormLabel>
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
            <FormField
              name="available"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Switch
                        checked={field.value} // Make sure it's a boolean (default to false if undefined)
                        onCheckedChange={field.onChange} // This ensures the form state updates
                        className={`${
                          field.value ? "bg-blue-600" : "bg-gray-200"
                        } relative inline-flex items-center h-6 rounded-full w-11`}
                      >
                        <span
                          className={`${
                            field.value ? "translate-x-6" : "translate-x-1"
                          } inline-block w-4 h-4 transform bg-white rounded-full transition`}
                        />
                      </Switch>
                    </div>
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

export default StaffEditedPage;
