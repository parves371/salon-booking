"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface BookingDetails {
  booking_id: number;
  booking_date: string;
  booking_status: string;
  customer: {
    name: string;
    number: string;
    email: string;
  };
  payment: {
    method: string;
    status: string;
    date: string;
    price: number;
  };
  services: {
    name: string;
    start_time: string;
    end_time: string;
    price: number;
    status: string;
    id: number;
  }[];
}

const BookingDetailPage = () => {
  const params = useParams();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedBookingStatus, setUpdatedBookingStatus] = useState<string>("");
  const [updatedServiceStatuses, setUpdatedServiceStatuses] = useState<
    string[]
  >([]);

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ book_id: params.bookingId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch booking details.");
        }

        const data = await response.json();
        setBookingDetails(data);
        setUpdatedBookingStatus(data.booking_status);
        setUpdatedServiceStatuses(
          data.services.map((service: any) => service.status)
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [params.bookingId]);

  // Submit updated booking status
  const handleBookingSubmit = async () => {
    if (!bookingDetails) {
      toast({
        title: "Error",
        description: `Booking details are missing.`,
      });
      return;
    }

    const payload = {
      id: bookingDetails.booking_id,
      status: updatedBookingStatus,
    };

    try {
      const response = await fetch(`/api/payment/update-book-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking status.");
      }
      toast({
        title: "Success",
        description: `Booking status updated successfully!`,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: `Failed to update booking status.`,
      });
    }
  };

  // Submit updated service status
  const handleServiceSubmit = async (index: number) => {
    if (!bookingDetails) return;

    const payload = {
      id: bookingDetails.services[index].id,
      status: updatedServiceStatuses[index],
    };

    try {
      const response = await fetch("/api/payment/update-service-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update service status.");
      }
      toast({
        title: "Success",
        description: `Service "${bookingDetails.services[index].name}" updated successfully!`,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: `Failed to update service "${bookingDetails.services[index].name}".`,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "processing":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      case "cancelled":
        return "text-red-500";
      case "hold":
        return "text-gray-500";
      default:
        return "text-gray-700";
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!bookingDetails) return <p>No booking details found.</p>;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Booking Details</h1>

      {/* Booking Information */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
        {/* Date and Order ID */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m0 0H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-2m-5-4h4m-4 0H5m4 0H5m4 0h2m0-2V7m0 4h5m-5 0v4m0 0H9m4 0h2m0 0h5"
              />
            </svg>
            <span>
              {new Date(bookingDetails.booking_date).toLocaleString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="text-gray-500 text-sm">
            Order ID:{" "}
            <span className="font-medium">{bookingDetails.booking_id}</span>
          </div>
        </div>

        {/* Status, Save Button, and Print Icon */}
        <div className="flex items-center space-x-4">
          {/* Status Dropdown */}
          <select
            value={updatedBookingStatus}
            onChange={(e) => setUpdatedBookingStatus(e.target.value)}
            className="border border-gray-300 bg-gray-100 text-gray-700 text-sm rounded-lg px-4 py-2"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="hold">Hold</option>
          </select>

          {/* Save Button */}
          <button
            onClick={handleBookingSubmit}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-teal-700"
          >
            Save
          </button>

          {/* Print Icon */}
          <button className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2v3a1 1 0 001 1h10a1 1 0 001-1v-3a2 2 0 002-2V6a2 2 0 00-2-2H4zm10 3a1 1 0 100 2h2a1 1 0 100-2h-2z"
                clipRule="evenodd"
              />
              <path d="M6 10a1 1 0 100-2h6a1 1 0 100-2H6a1 1 0 100 2h6z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Customer Details */}
      <div className="border p-4 rounded shadow">
        <h2 className="text-lg font-semibold">Customer Details</h2>
        <p>
          <strong>Name:</strong> {bookingDetails.customer.name}
        </p>
        <p>
          <strong>Number:</strong> {bookingDetails.customer.number}
        </p>
        <p>
          <strong>Email:</strong> {bookingDetails.customer.email}
        </p>
      </div>

      {/* Service Details */}
      <div className="border p-4 rounded shadow">
        <h2 className="text-lg font-semibold">Service Details</h2>
        <ul className="space-y-4">
          {bookingDetails.services.map((service, index) => (
            <li key={index} className="border p-4 rounded shadow">
              <p>
                <strong>Service:</strong> {service.name}
              </p>
              <p>
                <strong>Start Time:</strong>{" "}
                {new Date(service.start_time).toLocaleString()}
              </p>
              <p>
                <strong>End Time:</strong>{" "}
                {new Date(service.end_time).toLocaleString()}
              </p>
              <p>
                <strong>Price:</strong> ${Number(service.price).toFixed(2)}
              </p>
              <div className="mt-2">
                <strong>Status:</strong>{" "}
                <select
                  value={updatedServiceStatuses[index]}
                  onChange={(e) => {
                    const newStatuses = [...updatedServiceStatuses];
                    newStatuses[index] = e.target.value;
                    setUpdatedServiceStatuses(newStatuses);
                  }}
                  className={`border px-2 py-1 rounded ${getStatusColor(
                    updatedServiceStatuses[index]
                  )}`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="hold">Hold</option>
                </select>
              </div>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => handleServiceSubmit(index)}
              >
                Submit Service Status
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Details */}
      <div className="border p-4 rounded shadow">
        <h2 className="text-lg font-semibold">Payment Details</h2>
        <p>
          <strong>Method:</strong> {bookingDetails.payment.method}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={getStatusColor(bookingDetails.payment.status)}>
            {bookingDetails.payment.status}
          </span>
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(bookingDetails.payment.date).toLocaleString()}
        </p>
        <p>
          <strong>Price:</strong> $
          {Number(bookingDetails.payment.price).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default BookingDetailPage;
