"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For navigation to detail pages

// Define the type for a payment record
interface Payment {
  payment_id: number;
  payment_price: number;
  payment_method: string;
  payment_status: string;
  payment_date: string;
  book_id: number;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  customer_number: string;
}

const PaymentDetails = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [filters, setFilters] = useState({
    date: "",
    status: "",
    customerId: "",
  });

  const router = useRouter(); // Router for navigation

  // Fetch payment details
  const fetchPaymentDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/payment", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payment details");
      }

      const data = await response.json();
      setPayments(data.data); // Assuming the API response has a `data` field
      setFilteredPayments(data.data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching payment details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, []);

  // Handle search and filter
  const handleSearch = () => {
    const { date, status, customerId } = filters;

    const filtered = payments.filter((payment) => {
      const matchesDate = date
        ? new Date(payment.payment_date).toISOString().startsWith(date)
        : true;
      const matchesStatus = status ? payment.payment_status === status : true;
      const matchesCustomerId = customerId
        ? payment.customer_id.toString() === customerId
        : true;

      return matchesDate && matchesStatus && matchesCustomerId;
    });

    setFilteredPayments(filtered);
    setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  // Handle View Button Click
  const handleView = (paymentId: number) => {
    router.push(`/admin/payment/${paymentId}`); // Navigate to a detailed page
  };

  return (
    <div className="p-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/admin/payment">Payment</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-4">Payment Details</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-4">
            <input
              type="date"
              className="border px-2 py-1"
              value={filters.date}
              onChange={(e) =>
                setFilters({ ...filters, date: e.target.value })
              }
              placeholder="Search by Date"
            />
            <select
              className="border px-2 py-1"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <input
              type="text"
              className="border px-2 py-1"
              value={filters.customerId}
              onChange={(e) =>
                setFilters({ ...filters, customerId: e.target.value })
              }
              placeholder="Search by Customer ID"
            />
            <button
              className="bg-blue-500 text-white px-4 py-1"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Payment ID
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Price
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Payment Method
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Date
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Customer Details
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((payment) => (
                  <tr key={payment.payment_id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {payment.payment_id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {payment.payment_price}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {payment.payment_method}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 ${
                        payment.payment_status === "pending"
                          ? "text-yellow-500"
                          : payment.payment_status === "completed"
                          ? "text-green-500"
                          : payment.payment_status === "failed"
                          ? "text-red-500"
                          : "text-blue-500"
                      }`}
                    >
                      {payment.payment_status}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(payment.payment_date).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <p>ID: {payment.customer_id}</p>
                      <p>Name: {payment.customer_name}</p>
                      <p>Email: {payment.customer_email}</p>
                      <p>Phone: {payment.customer_number}</p>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="bg-blue-500 text-white px-4 py-1"
                        onClick={() => handleView(payment.book_id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              className="bg-gray-300 px-4 py-1"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="bg-gray-300 px-4 py-1"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;
