"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface WorkSchedule {
  id: number;
  staff_id: number;
  work_date: string;
  slot_start: string;
  slot_end: string;
  status: "free" | "booked" | "off";
}

const UsersPage = () => {
  const [workSchedules, setWorkSchedules] = useState<WorkSchedule[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const fetchWorkSchedules = async () => {
    try {
      const res = await axios.get("/api/product/works", {
        withCredentials: true,
      });
      setWorkSchedules(res.data?.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

  const editWorkSchedule = (id: number) => {
    router.push(`/admin/works/edit/${id}`);
  };

  const deleteWorkSchedule = async (id: number) => {
    try {
      await axios.delete(`/api/product/works/${id}`);
      setWorkSchedules(workSchedules.filter((work) => work.id !== id));
      toast({ title: "Work schedule deleted successfully!" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete work schedule.",
      });
    }
  };

  const newWorkSchedule = () => {
    router.push("/admin/works/create");
  };

  useEffect(() => {
    fetchWorkSchedules();
  }, []);

  return (
    <div className="px-16">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/works">Work Schedules</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between mt-8 items-center">
        <h2 className="text-3xl font-semibold">Work Schedules</h2>
        <Button variant={"default"} onClick={newWorkSchedule}>
          New Work Schedule
        </Button>
      </div>

      <div className="overflow-x-auto border rounded-lg p-4 mt-4">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Staff ID</th>
              <th className="border px-4 py-2">Work Date</th>
              <th className="border px-4 py-2">Start Time</th>
              <th className="border px-4 py-2">End Time</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {workSchedules.map((work) => (
              <tr key={work.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{work.id}</td>
                <td className="border px-4 py-2">{work.staff_id}</td>
                <td className="border px-4 py-2">{work.work_date}</td>
                <td className="border px-4 py-2">{work.slot_start}</td>
                <td className="border px-4 py-2">{work.slot_end}</td>
                <td className="border px-4 py-2">{work.status}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => editWorkSchedule(work.id)}
                  >
                    Edit
                  </button>

                  <Dialog>
                    <DialogTrigger className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      Delete
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="py-4">
                          Are you sure you want to delete this work schedule?
                        </DialogTitle>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          onClick={() => deleteWorkSchedule(work.id)}
                        >
                          Confirm
                        </button>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
