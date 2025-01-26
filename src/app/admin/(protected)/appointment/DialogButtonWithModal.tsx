import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";

interface DialogButtonWithModalProps {
  bookingId: number;
}

export const DialogButtonWithModal: React.FC<DialogButtonWithModalProps> = ({
  bookingId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null); // Store booking data here
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchBookingsDetailsById = async (id: number) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await fetch(`/api/product/bookings/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch booking data");
      }
      const data = await response.json();
      setBookingData(data); // Set the booking data when fetched
    } catch (error) {
      setIsError(true); // Handle errors
      console.error("Error fetching booking data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch booking details when modal is opened or bookingId changes
  useEffect(() => {
    if (isOpen) {
      setBookingData(null); // Reset previous booking data
      fetchBookingsDetailsById(bookingId); // Fetch the new booking data
    }
  }, [isOpen, bookingId]); // Re-run when either isOpen or bookingId changes

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-neutral-800">
          <EyeIcon className="mr-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {isLoading && <div>Loading booking data...</div>}
        {isError && (
          <span className="text-red-500">Failed to load booking data.</span>
        )}
        {bookingData ? (
          <div className="mt-4">
            <div className="flex flex-col gap-2">
              <span>
                <strong>Booking ID:</strong> {bookingData.booking_id}
              </span>
              <span>
                <strong>Customer ID:</strong> {bookingData.customer_id}
              </span>
            </div>
            {/* Table for Services */}
            <h3 className="text-xl font-semibold mt-4">Services:</h3>
            <div className="overflow-x-auto">
              {" "}
              {/* Wrapping the table in a div */}
              <table className="min-w-full table-auto mt-4 border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border text-left">Service Name</th>
                    <th className="px-4 py-2 border text-left">Price</th>
                    <th className="px-4 py-2 border text-left">Status</th>
                    <th className="px-4 py-2 border text-left">Start Time</th>
                    <th className="px-4 py-2 border text-left">End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingData.services.map((service: any, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border">
                        {service.service_name}
                      </td>
                      <td className="px-4 py-2 border">
                        {service.service_price}
                      </td>
                      <td className="px-4 py-2 border">
                        {service.service_status}
                      </td>
                      <td className="px-4 py-2 border">
                        {new Date(service.start_time).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 border">
                        {new Date(service.end_time).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <span>No booking data available.</span>
        )}

        <div className="mt-4 flex justify-end space-x-4">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => setIsOpen((prev) => !prev)} // Closes the modal
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
