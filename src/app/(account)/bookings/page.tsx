"use client";
import { Button } from "@/components/ui/button";
import { useBookingsByCustomerID } from "@/hooks/product/use-bookings";
import { EyeIcon } from "lucide-react";
import React from "react";

// Define the status types explicitly
type BookingStatusType = "pending" | "processing" | "completed" | "cancelled";

// Enum for booking statuses with color mappings
const BookingStatus: Record<
  BookingStatusType,
  { label: string; color: string }
> = {
  pending: { label: "Pending", color: "bg-yellow-500" },
  processing: { label: "Processing", color: "bg-blue-500" },
  completed: { label: "Completed", color: "bg-green-500" },
  cancelled: { label: "Cancelled", color: "bg-red-500" },
};

const Page = () => {
  const { data, isLoading, isError } = useBookingsByCustomerID(4);

  if (isLoading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (isError || !data) {
    return (
      <div className="text-center p-5 text-red-500">Error loading data</div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString(); // Formats the date to a readable string
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">Bookings</h1>
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-100 border-b text-left text-sm font-medium text-gray-700">
              Booking ID
            </th>
            <th className="px-6 py-3 bg-gray-100 border-b text-left text-sm font-medium text-gray-700">
              Price
            </th>
            <th className="px-6 py-3 bg-gray-100 border-b text-left text-sm font-medium text-gray-700">
              Status
            </th>
            <th className="px-6 py-3 bg-gray-100 border-b text-left text-sm font-medium text-gray-700">
              Created At
            </th>
            <th className="px-6 py-3 bg-gray-100 border-b text-left text-sm font-medium text-gray-700">
              show details
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((booking: any) => {
            // Ensure the status is a valid key from the BookingStatus enum
            const statusKey = booking.status.toLowerCase() as BookingStatusType;
            const status = BookingStatus[statusKey] || {
              label: "Unknown",
              color: "bg-gray-500",
            };

            return (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b text-sm text-gray-900">
                  {booking.id}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-900">
                  ${parseFloat(booking.price).toFixed(2)}
                </td>

                <td
                  className={`px-6 py-4 border-b text-sm text-white font-medium text-center ${status.color}`}
                >
                  {status.label}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-900">
                  {formatDate(booking.created_at)}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-900">
                  <ModalForBookingsDetails id={booking.id} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Page;

const ModalForBookingsDetails = ({ id }: { id: number }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  console.log("isOpen", id);

  return (
    <Button
      variant="outline"
      className="text-neutral-800"
      onClick={() => setIsOpen((prev) => !prev)}
    >
      <EyeIcon />
    </Button>
  );
};
