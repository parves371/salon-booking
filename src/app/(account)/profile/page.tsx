"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { LoaderIcon } from "lucide-react";
function maskEmail(email: string): string {
  if (!email || typeof email !== "string") return "Please enter your email";
  const [username, domain] = email.split("@");
  if (!domain) return "Invalid email format";

  const visibleUsername = username.slice(0, 3); // Keep the first 3 characters
  const maskedUsername =
    visibleUsername + "*".repeat(Math.max(username.length - 3, 0)); // Mask the rest of the username
  return `${maskedUsername}@${domain}`;
}

const Page = () => {
  const { data, isError, error, isLoading } = useUser();
  const user = data?.user;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderIcon className="size-5 spin-in-1" />
      </div>
    );
  }
  if (isError) {
    return <div>{error.message}</div>;
  }
  return (
    <div className=" bg-gray-50 px-4 sm:px-6 lg:px-8 w-[350px] md:w-[450px] lg:w-[750px]">
      <Card className="mt-16 w-full mx-auto">
        <CardHeader className="border-b border-gray-200 pb-4">
          <CardTitle className="text-lg font-semibold sm:text-xl">
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {/* Render User Information */}
          {user ? (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Full Name
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {user.name || "Please enter your name"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email Address
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {user.email
                    ? maskEmail(user.email)
                    : "Please enter your email"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Mobile
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {user.number || "Please enter your mobile"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No user data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
