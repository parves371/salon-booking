import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Header";
import { Inter } from "next/font/google";
import { NavBarServices } from "./navbar-services";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Wizard Example",
  description: "3-step wizard with Zustand + Next.js",
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
