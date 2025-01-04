"use client";
import MultiSelectDropdown from "@/components/admin/MultiSelectDropdown";
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
import { Switch } from "@/components/ui/switch";
import { useOption } from "@/hooks/product/use-options";
import { useServices } from "@/hooks/product/use-services";
import { useAddStaff } from "@/hooks/use-staff";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { StaffSchema } from "@/schemas/staff";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface UserProps {
  id: number;
  name: string;
  email: string;
}
interface OptionDetails {
  id: number; // Option ID
  option_name: string; // Name of the option
  option_price: string; // Price of the option as a string
  option_time: string; // Time required for the option
  service_name: string; // Associated service name
  category_name: string; // Associated category name
}

interface Service {
  id: number;
  category_name: string;
  service_name: string;
  time: string;
  price: string;
  option: boolean;
}

const options = ["Tag1", "Tag2", "Tag3", "Tag4"];
const CategoryAdd = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // feacthing data from the server | admin user
  const { data, isLoading, isError, error } = useUser();
  // add staff mutation
  const addStaff = useAddStaff();

  const { data: optionData } = useOption();
  const { data: serviceData } = useServices();
  const optionName =
    optionData?.data.map((option: OptionDetails) => option.option_name) || [];
  const ServicesName =
    serviceData?.data.map((option: Service) => option.service_name) || [];

  const optionAndServiceName = [...optionName, ...ServicesName];

  const [tags, setTags] = useState<string[]>([]);
  const handleTagChange = (selectedTags: string[]) => {
    setTags(selectedTags);
  };

  const form = useForm<z.infer<typeof StaffSchema>>({
    resolver: zodResolver(StaffSchema),
    defaultValues: {
      position: "",
      available: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof StaffSchema>) => {
    if (selectedUserId == null) {
      toast({
        title: "Error",
        description: "User ID is required",
      });
      return;
    }
    const payload = {
      ...data,
      userId: selectedUserId,
      skills: tags,
    };

    addStaff.mutate(payload);
  };

  const handleSelectChange = (value: string) =>
    setSelectedUserId(parseInt(value));

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
            <BreadcrumbLink href="/admin/staff">Staff</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>Create</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-16 max-w-[1000px] w-full mx-auto">
        <CardHeader>
          <CardTitle>Add Staff</CardTitle>
          <MultiSelectDropdown
            options={optionAndServiceName}
            onChange={handleTagChange}
          />
        </CardHeader>
        <CardContent>
          <Select
            // value={selectedCategoryId?.toString()}
            onValueChange={handleSelectChange}
          >
            <span className="block my-2 text-xl font-semibold">
              Selected User
            </span>
            <SelectTrigger className="w-[180px] my-4">
              <SelectValue placeholder="Select User" />
            </SelectTrigger>
            <SelectContent>
              {data?.allUsers?.map((user: UserProps) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <FormField
                name="position"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>position</FormLabel>
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
