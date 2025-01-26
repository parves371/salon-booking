"use client";

import MultiSelectDropdown from "@/components/admin/MultiSelectDropdown";
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
import { useOption } from "@/hooks/product/use-options";
import { useServices } from "@/hooks/product/use-services";
import { useRenameStaff, useStaffById } from "@/hooks/use-staff";
import { useUser } from "@/hooks/use-user";
import { StaffSchema } from "@/schemas/staff";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Types for the data structures
interface UserAdminProps {
  id: number;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "manager" | "employee";
  skills: string;
  created_at: string; // ISO string format for dates
}

interface Service {
  id: number;
  category_name: string;
  service_name: string;
  time: string;
  price: string;
  option: boolean;
}

interface OptionDetails {
  id: number; // Option ID
  option_name: string;
  option_price: string;
  option_time: string;
  service_name: string;
  category_name: string; // Associated category name
}

const StaffEditedPage = () => {
  const router = useRouter();
  const params = useParams<Record<string, string>>();
  const [tags, setTags] = useState<string[]>([]);

  // Fetching staff details by ID
  const {
    data: staff,
    error,
    isLoading,
    isError,
  } = useStaffById(params.id ? parseInt(params.id) : 0);
  // Effect to set the default tags when staff data is loaded
  let defaultTags = staff?.data?.skills ? staff.data.skills.split(",") : [];

  useEffect(() => {
    if (staff?.data?.skills) {
      // Update tags state when staff data is fetched
      defaultTags = staff.data.skills.split(",");
    }
  }, [staff?.data]);

  const { data: allAdminUser } = useUser();
  const renameStaff = useRenameStaff();

  // Fetching option and service data
  const { data: optionData } = useOption();
  const { data: serviceData } = useServices();

  // Combining the options and services for the multi-select dropdown
  const optionName =
    optionData?.data.map((option: OptionDetails) => option.option_name) || [];
  const ServicesName =
    serviceData?.data.map((option: Service) => option.service_name) || [];
  const optionAndServiceName = [...optionName, ...ServicesName];

  // Handler for when tags are selected or changed
  const handleTagChange = (selectedTags: string[]) => {
    setTags(selectedTags);
  };

  // Setting up the form with validation schema
  const form = useForm<z.infer<typeof StaffSchema>>({
    resolver: zodResolver(StaffSchema),
    defaultValues: {
      position: "",
      available: false,
    },
  });

  // Submit handler for the form
  const onSubmit = async (data: z.infer<typeof StaffSchema>) => {
    const payload = {
      id: params.id ? parseInt(params.id) : 0,
      position: data.position,
      available: data.available,
      userId: allAdminUser?.allUsers?.find(
        (user: UserAdminProps) => user.name === staff?.data?.name
      )?.id,
      skills: tags.join(","), // Comma-separated string for selected skills
    };

    // Send the update request
    renameStaff.mutate(payload);
    router.push("/admin/staff"); // Navigate back to staff list
  };

  // Effect to pre-fill the form with existing data when staff details are loaded
  useEffect(() => {
    if (staff?.data) {
      form.setValue("available", staff?.data.available ? true : false);
      form.setValue("position", staff?.data.position);
    }
  }, [staff?.data, form]);

  // Cancel button handler to navigate back to staff list
  const cancelButton = () => {
    router.push("/admin/staff");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderIcon className="size-5 spin-in-1" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="px-16">
      {/* Breadcrumb for navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/admin/staff">Staff</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>Edit</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Staff edit form container */}
      <div className="p-6 max-w-2xl mx-auto border rounded-lg bg-white shadow mt-16">
        <h2 className="text-2xl font-bold mb-4">Edit staff</h2>

        {/* Multi-select dropdown for skills */}
        <MultiSelectDropdown
          options={optionAndServiceName}
          onChange={handleTagChange}
          defaultValue={defaultTags} // Populate with existing skills
        />

        {/* Form for position and availability */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Position Field */}
            <FormField
              name="position"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
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

            {/* Availability Toggle */}
            <FormField
              name="available"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Switch
                        checked={field.value} // Ensure it's a boolean value
                        onCheckedChange={field.onChange}
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

            {/* Submit and Cancel buttons */}
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
