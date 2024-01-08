import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SyntheticEvent } from "react";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Deskify",
  description: "Deskify",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const handleClick = (e: SyntheticEvent) => {
    console.log(e.target)
  }

  return (
    <html lang="en">
      <body
        className={`flex flex-col justify-between min-h-screen ${inter.className}`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
