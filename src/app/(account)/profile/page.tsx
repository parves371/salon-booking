"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderIcon } from "lucide-react";
// If you have a custom hook for fetching user data:
import { useUser } from "@/hooks/use-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function maskEmail(email: string): string {
  if (!email || typeof email !== "string") return "Please enter your email";
  const [username, domain] = email.split("@");
  if (!domain) return "Invalid email format";

  const visibleUsername = username.slice(0, 3); // Keep first 3 chars
  const maskedUsername =
    visibleUsername + "*".repeat(Math.max(username.length - 3, 0)); // Mask the rest
  return `${maskedUsername}@${domain}`;
}

export default function ProfilePage() {
  const { data, isError, error, isLoading } = useUser();
  const user = data?.user;

  console.log(user)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoaderIcon className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    // Show an error message if the hook fails
    return <div className="mt-4 text-red-600">{error?.message}</div>;
  }

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 w-full max-w-3xl mx-auto">
      <Card className="mt-12 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-xl font-semibold">My Profile</CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {user ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Profile picture (if available) */}
              {user.profile ? (
                <Avatar className="h-20 w-20">
                  <AvatarImage  src={user.profile} alt="@shadcn" />
                  <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Full Name
                </label>
                <p className="text-sm font-semibold text-gray-800">
                  {user.name || "Please enter your name"}
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Email Address
                </label>
                <p className="text-sm font-semibold text-gray-800">
                  {user.email
                    ? maskEmail(user.email)
                    : "Please enter your email"}
                </p>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Mobile
                </label>
                <p className="text-sm font-semibold text-gray-800">
                  {user.number || "Please enter your mobile number"}
                </p>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Date of Birth
                </label>
                <p className="text-sm font-semibold text-gray-800">
                  {user.date_of_birth
                    ? new Date(user.date_of_birth).toLocaleDateString()
                    : "no date of birth available"}
                </p>
              </div>

              {/* Address (occupies full width if you prefer) */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Address
                </label>
                <p className="text-sm font-semibold text-gray-800">
                  {user.address || "no address available"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No user data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
