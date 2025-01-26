"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAdminUser, useStaffByAdminUserId } from "@/hooks/use-user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Dashboard = () => {
  const router = useRouter();

  // Get the admin user data
  const { data: adminUser, isLoading: adminLoading } = useAdminUser(); // Assuming `logout` is part of your hook
  const adminUserID = adminUser?.user?.id;

  // Get the staff user data
  const { data: staffUser, isLoading: staffLoading } =
    useStaffByAdminUserId(adminUserID);

  const logout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "GET" });
      if (res.ok) {
        // Redirect to login page or handle logout
        router.push("/admin/login");
      } else {
        const data = await res.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (adminLoading || staffLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (!staffUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-500">
          No staff data found.
        </p>
      </div>
    );
  }

  const { user_name, email, position, role, skills, avatar_path, created_at } =
    staffUser;

  return (
    <section className="min-h-screen bg-gray-50 p-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/admin/dashboard">Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* User Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
              {avatar_path ? (
                <img
                  src={avatar_path}
                  alt={user_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No Avatar
                </div>
              )}
            </div>
            {/* Basic Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user_name}</h1>
              <p className="text-gray-600">{position}</p>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>
          {/* Logout Button */}
          <button
            onClick={logout} // Call the logout function
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Additional Details */}
        <div className="mt-6 space-y-4">
          {/* Role */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Role</h2>
            <p className="text-gray-600 capitalize">{role}</p>
          </div>
          {/* Skills */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.split(",").map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          {/* Joining Date */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Joined On</h2>
            <p className="text-gray-600">
              {new Date(created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
