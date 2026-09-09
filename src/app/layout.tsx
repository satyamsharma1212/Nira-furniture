import type { Metadata, Viewport } from "next";
import "./globals.css";

import NavbarSwitcher from "@/components/NavbarSwitcher";
import EnquiryPopup from "@/components/EnquiryPopup";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: {
    default: "NIRA Furniture | Premium Outdoor & Indoor Furniture",
    template: "%s | NIRA Furniture",
  },
  description:
    "NIRA Furniture manufactures premium outdoor and indoor furniture in India. Custom furniture, luxury outdoor sofas, lounge chairs, dining furniture and more.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#eeeae4] text-[#181818] antialiased selection:bg-[#B88A2B] selection:text-white">
        <NavbarSwitcher />

        <main className="relative min-h-screen">
          {children}
        </main>

        <EnquiryPopup />

        <Footer />

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}