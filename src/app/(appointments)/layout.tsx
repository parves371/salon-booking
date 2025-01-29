import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Header";
import { Inter } from "next/font/google";
import { NavBarServices } from "./navbar-services";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Appointments",
  description: "",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <NavBarServices />

      {children}

      <Footer />
    </>
  );
}
