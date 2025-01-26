"use client";
import { useBookingsByCustomerID } from "@/hooks/product/use-bookings";
import { DialogButtonWithModal } from "./DialogButtonWithModal";
import { useUser } from "@/hooks/use-user";
import { priceCurrency } from "@/utils/constants";

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
  const { data, isLoading, isError } = useBookingsByCustomerID(user?.user?.id);

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
                Booking ID
              </th>
              <th className="px-6 py-3 bg-gray-100 border-b text-left text-sm font-medium text-gray-700">
                Price
              </th>
              <th className="px-6 py-3 bg-gray-100 border-b text-left text-sm font-medium text-gray-700">
                Booking Status
              </th>
              <th className="px-6 py-3 bg-gray-100 border-b text-left text-sm font-medium text-gray-700">
                Payment Status
              </th>
              <th className="px-6 py-3 bg-gray-100 border-b text-left text-sm font-medium text-gray-700">
                Created At
              </th>
              <th className="px-6 py-3 bg-gray-100 border-b text-left text-sm font-medium text-gray-700">
                Show Details
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((booking: any) => {
              // Ensure the status is a valid key from the BookingStatus enum
              const bookingStatusKey =
                booking.book_status.toLowerCase() as BookingStatusType;
              const bookingStatus = BookingStatus[bookingStatusKey] || {
                label: "Unknown",
                color: "bg-gray-500",
              };

              // Ensure the payment status is a valid key from the PaymentStatus enum
              const paymentStatusKey =
                booking.payment_status?.toLowerCase() as PaymentStatusType;
              const paymentStatus = PaymentStatus[paymentStatusKey] || {
                label: "Unknown",
                color: "bg-gray-500",
              };

              return (
                <tr key={booking.book_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b text-sm text-gray-900">
                    {booking.book_id}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-900">
                    {priceCurrency.symbol}{parseFloat(booking.price).toFixed(2)}
                  </td>

                  <td
                    className={`px-6 py-4 border-b text-sm text-white font-medium text-center ${bookingStatus.color}`}
                  >
                    {bookingStatus.label}
                  </td>

                  <td
                    className={`px-6 py-4 border-b text-sm text-white font-medium text-center ${paymentStatus.color}`}
                  >
                    {paymentStatus.label}
                  </td>

                  <td className="px-6 py-4 border-b text-sm text-gray-900">
                    {formatDate(booking.book_created_at)}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-900">
                    <DialogButtonWithModal bookingId={booking.book_id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsPage;
