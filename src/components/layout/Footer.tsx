import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#2E3845] to-[#804B42]">
      <div className="">
        <div className="py-8 container mx-auto px-4 md:px-0">
          <h2 className="text-[1.75rem] font-medium text-white text-center">
            Everyone can discover their hidden beauty.{" "}
            <Link href={""} className="underline">
              Book an appointment
            </Link>{" "}
          </h2>
        </div>

        <div className="border-b h-[1px] text-[#424C59] border-[#424C59]" />

        <div className="container mx-auto px-4 md:px-0 py-8 flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="flex justify-center md:justify-start">
            <Image
              width={184}
              height={42}
              src={"/images/demo-beauty-salon-logo-white.png"}
              alt="logo"
            />
          </div>
          <div className="flex flex-col md:w-1/4">
            <ul className="flex flex-col gap-2">
              <li className="text-[#ffa085] text-xl font-semibold">
                Get in touch
              </li>
              <li className="text-lg text-white font-medium mt-1">
                401 Broadway, 24th Floor
              </li>
              <li className="text-lg text-white font-medium">
                New York, NY 10013
              </li>
            </ul>
          </div>
          <div className="flex flex-col md:w-1/4">
            <ul className="flex flex-col gap-2">
              <li className="text-[#ffa085] text-xl font-semibold">
                Need support?
              </li>
              <li className="text-lg text-white font-medium mt-1">
                1-800-222-000
              </li>
              <li className="text-lg text-white font-medium">
                info@yourdomain.com
              </li>
            </ul>
          </div>
          <div className="flex flex-col md:w-1/4">
            <ul>
              <li className="text-[#ffa085] text-xl font-semibold">
                Connect with us
              </li>
              <ul className="flex text-xl text-white gap-4 mt-3">
                <li className="border p-4 rounded-full hover:text-black hover:bg-white transition-all delay-150">
                  <FaFacebook />
                </li>
                <li className="border p-4 rounded-full hover:text-black hover:bg-white transition-all delay-150">
                  <FaInstagram />
                </li>
                <li className="border p-4 rounded-full hover:text-black hover:bg-white transition-all delay-150">
                  <FaTwitter />
                </li>
              </ul>
            </ul>
          </div>
        </div>
        <div className="border-b h-[1px] text-[#424C59] border-[#424C59]" />

        <div className="container mx-auto px-4 md:px-0 mt-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <div>
            <ul className="flex gap-4 text-white text-lg mb-4">
              <li>
                <Link href={"/"}>Home</Link>
              </li>
              <li>
                <Link href={"/"}>Appointment</Link>
              </li>
              <li>
                <Link href={"/"}>Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="text-white text-lg text-center md:text-left">
              © 2024 Crafto is Proudly Powered by{" "}
              <Link href={""} className="underline">
                ThemeZaa
              </Link>
            </h6>
          </div>
        </div>
      </div>
    </footer>
  );
};
