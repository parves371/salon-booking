"use client";
import { DialogButtonWithModal } from "@/app/(account)/bookings/DialogButtonWithModal";
import {
  useBookingsByAdminID,
  useBookingsByCustomerID,
} from "@/hooks/product/use-bookings";
import { useUser } from "@/hooks/use-user";

// Define the status types explicitly
type BookingStatusType = "pending" | "processing" | "completed" | "cancelled";
type PaymentStatusType = "pending" | "completed" | "failed" | "refunded";

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

// Enum for payment statuses with color mappings
const PaymentStatus: Record<
  PaymentStatusType,
  { label: string; color: string }
> = {
  pending: { label: "Pending", color: "bg-yellow-400" },
  completed: { label: "Completed", color: "bg-green-400" },
  failed: { label: "Failed", color: "bg-red-400" },
  refunded: { label: "Refunded", color: "bg-purple-400" },
};

const BookingsPage = () => {
  const { data: user } = useUser();
  const { data, isLoading, isError } = useBookingsByAdminID(1);
  console.log(data);
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
    <div className="px-4 py-6 max-w-[1200px] mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">Bookings</h1>
      <div className="overflow-x-auto">
        {" "}
        {/* Make the table scrollable on small screens */}
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-100 border-b text-left text-sm font-medium text-gray-700">
                Service ID
              </th>
              <th className="px-6 py-3 bg-gray-100 border-b text-left text-sm font-medium text-gray-700">
                Booking ID
              </th>
              <th className="px-6 py-3 bg-gray-100 border-b text-left text-sm font-medium text-gray-700">
                Customer Name
              </th>
              <th className="px-6 py-3 bg-gray-100 border-b text-left text-sm font-medium text-gray-700">
                Service Name
              </th>
              <th className="px-6 py-3 bg-gray-100 border-b text-left text-sm font-medium text-gray-700">
                Start Time
              </th>
              <th className="px-6 py-3 bg-gray-100 border-b text-left text-sm font-medium text-gray-700">
                End Time
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
            </tr>
          </thead>
          <tbody>
            {data?.map((service: any) => (
              <tr key={service.service_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b text-sm text-gray-900">
                  {service.service_id}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-900">
                  {service.booking_id}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-900">
                  {service.customer_name}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-900">
                  {service.service_name}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-900">
                  {formatDate(service.start_time)}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-900">
                  {formatDate(service.end_time)}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-900">
                  ${parseFloat(service.service_price).toFixed(2)}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-900">
                  {service.service_status}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-900">
                  {formatDate(service.service_created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsPage;
