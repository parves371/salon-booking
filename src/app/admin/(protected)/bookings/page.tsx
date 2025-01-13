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

import { useDeleteBookings, useWorks } from "@/hooks/product/use-bookings";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const BookingsPage = () => {
  const router = useRouter();
  const { data, isError, isLoading, error } = useWorks();
  const { mutate } = useDeleteBookings();

  const deleteWorkSchedule = async (id: number) => {
    mutate(id);
  };

  const editBooking = (id: number) => {
    router.push(`/admin/bookings/edit/${id}`);
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
            <BreadcrumbLink href="/admin/works">
              Bookings Schedules
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between mt-8 items-center">
        <h2 className="text-3xl font-semibold">Bookings Schedules</h2>
      </div>

      <div className="overflow-x-auto border rounded-lg p-4 mt-4">
        <BookingDetails
          bookings={data || []}
          onDelete={deleteWorkSchedule}
          editBooking={editBooking}
        />
      </div>
    </div>
  );
};

export default BookingsPage;

// Define the shape of the booking object
export interface Booking {
  booking_id: number;
  customer_id: number;
  customer_name: string;
  end_time: string;
  service_id: number;
  service_name: string;
  staff_id: number;
  staff_position: string;
  staff_user_name: string;
  start_time: string;
  status: "pending" | "processing" | "completed" | "cancelled";
}

// Define the props type for the BookingDetails component
interface BookingDetailsProps {
  bookings: Booking[];
  onDelete: (booking_id: number) => void;
  onEdit?: (booking_id: number) => void;
  editBooking: (booking_id: number) => void;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({
  bookings,
  onDelete,
  editBooking,
  onEdit,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg p-4 mt-4">
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Booking ID</th>
            <th className="border px-4 py-2">Customer ID</th>
            <th className="border px-4 py-2">Customer Name</th>
            <th className="border px-4 py-2">Service Name</th>
            <th className="border px-4 py-2">Staff Name</th>
            <th className="border px-4 py-2">Staff Position</th>
            <th className="border px-4 py-2">Start Time</th>
            <th className="border px-4 py-2">End Time</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const formattedStartTime = new Date(
              booking.start_time
            ).toLocaleString();
            const formattedEndTime = new Date(
              booking.end_time
            ).toLocaleString();

            return (
              <tr key={booking.booking_id}>
                <td className="border px-4 py-2">{booking.booking_id}</td>
                <td className="border px-4 py-2">{booking.customer_id}</td>
                <td className="border px-4 py-2">{booking.customer_name}</td>
                <td className="border px-4 py-2">{booking.service_name}</td>
                <td className="border px-4 py-2">{booking.staff_user_name}</td>
                <td className="border px-4 py-2">{booking.staff_position}</td>
                <td className="border px-4 py-2">{formattedStartTime}</td>
                <td className="border px-4 py-2">{formattedEndTime}</td>
                <td className="border px-4 py-2">{booking.status}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => editBooking(booking.booking_id)}
                  >
                    Edit
                  </button>
                  <Dialog>
                    <DialogTrigger className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ">
                      Delete
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="py-4">
                          Are you absolutely sure?
                        </DialogTitle>

                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2"
                          onClick={() => onDelete(booking.booking_id)}
                        >
                          Confirm
                        </button>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
