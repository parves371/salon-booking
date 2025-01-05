"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
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
import { useStaff } from "@/hooks/use-staff";

import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";



interface StaffDetails {
  available: boolean;
  id: number;
  name: string;
  position: string;
  role: "superadmin" | "admin" | "manager" | "employee"; // Enum-like structure for roles
  skills: string | null; // Assuming skills could be a JSON string or null
}

const page = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedWorksId, setSelectedWorksId] = useState<number | null>(null);

  const { data: staffData } = useStaff();

  const WorksSchema = z.object({
    work_date: z.string().min(1, {
      message: "Name is required",
    }),
    slot_start: z.string().min(1, {
      message: "Price is required",
    }),
    slot_end: z.string().min(1, {
      message: "Time is required",
    }),
    status: z.enum(["free", "booked", "off"]),
  });

  const form = useForm<z.infer<typeof WorksSchema>>({
    resolver: zodResolver(WorksSchema),
    defaultValues: {
      work_date: "",
      slot_start: "",
      slot_end: "",
      status: "free",
    },
  });

  const onSubmit = async (data: z.infer<typeof WorksSchema>) => {
    const formData = {
      ...data,
      staff_id: selectedWorksId,
    };

    console.log(data);

    try {
      const res = await axios.post("/api/product/works", formData);
      if (res.status === 200) {
        toast({
          title: "Works Schedule created successfully!",
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
    setSelectedWorksId(parseInt(value));
  };
  const cancelButton = () => {
    router.push("/admin/works");
  };
  return (
    <div className="px-16">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/admin/works">Work Schedule</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>Create</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-16 max-w-[1000px] w-full mx-auto">
        <CardHeader>
          <CardTitle>Work Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedWorksId?.toString()}
            onValueChange={handleSelectChange}
          >
            <span className="block my-2 text-xl font-semibold">
              Selected Services
            </span>
            <SelectTrigger className="w-[180px] my-4">
              <SelectValue placeholder="Select Services" />
            </SelectTrigger>
            <SelectContent>
              {staffData?.data.map((staff: StaffDetails) => (
                <SelectItem key={staff.id} value={staff.id.toString()}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="work_date"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>work date</FormLabel>
                    <FormControl>
                      <input
                        type="date"
                        placeholder="enter date"
                        className="border rounded-md px-3 py-2 w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="slot_start"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>slot_start</FormLabel>
                    <FormControl>
                      <input
                        type="time"
                        placeholder=""
                        className="border rounded-md px-3 py-2 w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="slot_end"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>slot_end</FormLabel>
                    <FormControl>
                      <input
                        type="time"
                        placeholder=""
                        className="border rounded-md px-3 py-2 w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="status"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Option</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
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
                            <SelectItem value="free">free</SelectItem>
                            <SelectItem value="booked">booked</SelectItem>
                            <SelectItem value="off">off</SelectItem>
                          </SelectContent>
                        </Select>
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

export default page;
