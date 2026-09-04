import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import EnquiryPopup from "@/components/EnquiryPopup";

export const metadata: Metadata = {
  title: {
    default: "NIRA Furniture | Premium Outdoor & Indoor Furniture",
    template: "%s | NIRA Furniture",
  },
  description:
    "NIRA Furniture manufactures premium outdoor and indoor furniture in India. Custom furniture, luxury outdoor sofas, lounge chairs, dining furniture and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}

  <EnquiryPopup />
      </body>
    </html>
  );
}