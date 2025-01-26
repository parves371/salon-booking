"use client";

import { useAdminUser, useStaffByAdminUserId } from "@/hooks/use-user";
import { useEffect, useState } from "react";

interface Appointment {
  booking_service_id: number;
  booking_id: number;
  staff_id: number;
  services_id: number;
  start_time: string;
  end_time: string;
  price: string;
  status: string;
  discount: string | null;
  created_at: string;
  customer_name: string;
  service_name: string;
}

const StaffDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Get the admin user data
  const { data: adminUser, isLoading: adminLoading } = useAdminUser();
  const adminUserID = adminUser?.user?.id;

  // Get the staff user data
  const { data: staffUser, isLoading: staffLoading } =
    useStaffByAdminUserId(adminUserID);
  const staffUserID = staffUser?.staff_id;

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!staffUserID) {
        setError("Unable to identify the staff user.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all appointments for the staff user's ID
        const res = await fetch(`/api/appointments/${staffUserID}`);
        if (!res.ok) {
          throw new Error(await res.text());
        }

        const data: Appointment[] = await res.json();
        setAppointments(data);
        setFilteredAppointments(data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching the data.");
      } finally {
        setLoading(false);
      }
    };

    if (!adminLoading && !staffLoading && staffUserID) {
      fetchAppointments();
    }
  }, [adminLoading, staffLoading, staffUserID]);

  useEffect(() => {
    let filtered = appointments;

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter(
        (appointment) =>
          new Date(appointment.start_time).toISOString().split("T")[0] === filterDate
      );
    }

    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter((appointment) => appointment.status === filterStatus);
    }

    // Sort by time
    filtered.sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        : new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
    );

    setFilteredAppointments(filtered);
  }, [appointments, filterDate, filterStatus, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const currentData = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDate(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value || null);
  };

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (adminLoading || staffLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  if (!appointments.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-500">
          No upcoming appointments found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Appointments for You</h1>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="date"
            value={filterDate}
            onChange={handleDateChange}
            className="border rounded px-3 py-2 text-sm text-gray-700"
          />
          <select
            onChange={handleStatusChange}
            className="border rounded px-3 py-2 text-sm text-gray-700"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={handleSortOrderChange}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
          >
            Sort by Time ({sortOrder === "asc" ? "Ascending" : "Descending"})
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border-b text-sm font-medium text-gray-700">
                  Service Name
                </th>
                <th className="text-left px-4 py-2 border-b text-sm font-medium text-gray-700">
                  Customer Name
                </th>
                <th className="text-left px-4 py-2 border-b text-sm font-medium text-gray-700">
                  Start Time
                </th>
                <th className="text-left px-4 py-2 border-b text-sm font-medium text-gray-700">
                  End Time
                </th>
                <th className="text-left px-4 py-2 border-b text-sm font-medium text-gray-700">
                  Price
                </th>
                <th className="text-left px-4 py-2 border-b text-sm font-medium text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((appointment) => (
                <tr
                  key={appointment.booking_service_id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-2 border-b text-sm text-gray-600">
                    {appointment.service_name}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-600">
                    {appointment.customer_name}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-600">
                    {new Date(appointment.start_time).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-600">
                    {new Date(appointment.end_time).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-600">
                  AED {appointment.price}
                  </td>
                  <td
                    className={`px-4 py-2 border-b text-sm ${
                      appointment.status === "pending"
                        ? "text-yellow-500"
                        : appointment.status === "completed"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {appointment.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
