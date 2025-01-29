"use client";
import React from "react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/use-user";
import { LoaderIcon } from "lucide-react";
export const Navbar: React.FC = () => {
  const { data, isError, error, isLoading } = useUser();
  const user = data?.user;

  return (
    <header className="bg-gray-500 text-white">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-pink-400">
            Salon<span className="text-white">.</span>
          </span>
          <span className="text-2xl font-bold text-white">&#x2702;</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8 ">
          <Link href="/" className="hover:text-[#969CA3]">
            Home
          </Link>
          <Link href="/appointment" className="hover:text-[#969CA3]">
            appointment
          </Link>

          <Link href="/contact" className="hover:text-[#969CA3]">
            Contact
          </Link>
        </nav>

        {/* Contact Info */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-pink-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3h16.5a1.5 1.5 0 011.5 1.5v13.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V4.5a1.5 1.5 0 011.5-1.5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 6h7.5M8.25 9.75h7.5m-7.5 3.75h7.5"
                />
              </svg>
            </span>
            <span>1 800 222 000</span>
          </div>
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded">
            Let&apos;s Talk
          </button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user.profile} alt={user.name} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/bookings">Bookings</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
