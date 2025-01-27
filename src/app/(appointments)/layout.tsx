import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />

      {children}

      <Footer />
    </>
  );
}
