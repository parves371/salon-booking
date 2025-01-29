"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function maskEmail(email: string): string {
  if (!email || typeof email !== "string") return "Please enter your email";
  const [username, domain] = email.split("@");
  if (!domain) return "Invalid email format";

  const visibleUsername = username.slice(0, 3);
  const maskedUsername =
    visibleUsername + "*".repeat(Math.max(username.length - 3, 0));
  return `${maskedUsername}@${domain}`;
}

export default function ProfilePage() {
  const { data, isError, error, isLoading } = useUser();
  const user = data?.user;
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoaderIcon className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <div className="mt-4 text-red-600">{error?.message}</div>;
  }

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 w-full max-w-3xl mx-auto">
      <Card className="mt-12 shadow-sm">
        <CardHeader className="border-b border-gray-200 flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">My Profile</CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {user ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {user.profile ? (
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.profile} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="User Avatar"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Full Name
                </label>
                <p className="text-sm font-semibold text-gray-800">
                  {user.name || "Please enter your name"}
                </p>
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Mobile
                </label>
                <p className="text-sm font-semibold text-gray-800">
                  {user.number || "Please enter your mobile number"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Date of Birth
                </label>
                <p className="text-sm font-semibold text-gray-800">
                  {user.date_of_birth
                    ? new Date(user.date_of_birth).toLocaleDateString()
                    : "No date of birth available"}
                </p>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Address
                </label>
                <p className="text-sm font-semibold text-gray-800">
                  {user.address || "No address available"}
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
