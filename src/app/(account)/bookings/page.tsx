"use client";
import { useBookingsByCustomerID } from "@/hooks/product/use-bookings";
import React from "react";

// Define the status types explicitly
type BookingStatusType = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";

// Enum for booking statuses with color mappings
const BookingStatus: Record<
  BookingStatusType,
  { label: string; color: string }
> = {
  PENDING: { label: "pending", color: "bg-yellow-500" },
  PROCESSING: { label: "processing", color: "bg-blue-500" },
  COMPLETED: { label: "completed", color: "bg-green-500" },
  CANCELLED: { label: "cancelled", color: "bg-red-500" },
};

const Page = () => {
  const { data, isLoading, isError } = useBookingsByCustomerID(4);

  if (isLoading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center p-5 text-red-500">Error loading data</div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString(); // This will format the date to a readable format
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
              Service Name
            </th>
            <th className="px-6 py-3 bg-gray-100 border-b text-left text-sm font-medium text-gray-700">
              Staff User Name
            </th>
            <th className="px-6 py-3 bg-gray-100 border-b text-left text-sm font-medium text-gray-700">
              Start Time
            </th>
            <th className="px-6 py-3 bg-gray-100 border-b text-left text-sm font-medium text-gray-700">
              End Time
            </th>
            <th className="px-6 py-3 bg-gray-100 border-b text-left text-sm font-medium text-gray-700">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((booking: any) => {
            // Ensure the status is a valid key from the BookingStatus enum
            const statusKey = booking.status.toUpperCase() as BookingStatusType;
            const status = BookingStatus[statusKey] || {
              label: "Unknown",
              color: "bg-gray-500",
            };

            return (
              <tr key={booking.booking_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b text-sm text-gray-900">
                  {booking.booking_id}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-900">
                  {booking.service_name}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-900">
                  {booking.staff_user_name}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-900">
                  {formatDate(booking.start_time)}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-900">
                  {formatDate(booking.end_time)}
                </td>
                <td
                  className={`px-6 py-4 border-b text-sm text-white font-medium text-center ${status.color}`}
                >
                  {status.label}
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
