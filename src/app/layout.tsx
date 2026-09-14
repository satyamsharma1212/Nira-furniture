import type { Metadata, Viewport } from "next";
import "./globals.css";

import NavbarSwitcher from "@/components/NavbarSwitcher";
import EnquiryPopup from "@/components/EnquiryPopup";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

const SITE_URL = "https://nira-furniture-jet.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "NIRA Furniture | Premium Outdoor & Indoor Furniture",
    template: "%s | NIRA Furniture",
  },

  description:
    "NIRA Furniture manufactures premium outdoor and indoor furniture in India. Custom furniture, luxury outdoor sofas, lounge chairs, dining furniture and more.",

  keywords: [
    "NIRA Furniture",
    "luxury furniture India",
    "premium furniture India",
    "outdoor furniture India",
    "indoor furniture India",
    "luxury outdoor furniture",
    "outdoor sofas India",
    "lounge chairs India",
    "custom furniture India",
    "bespoke furniture India",
    "premium outdoor sofas",
    "luxury dining furniture",
    "outdoor furniture manufacturer India",
    "luxury furniture manufacturer India",
  ],

  authors: [
    {
      name: "NIRA Furniture",
    },
  ],

  creator: "NIRA Furniture",
  publisher: "NIRA Furniture",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "NIRA Furniture",

    title: "NIRA Furniture | Premium Outdoor & Indoor Furniture",

    description:
      "Discover premium outdoor and indoor furniture crafted by NIRA Furniture in India. Explore luxury sofas, lounge chairs, dining furniture and bespoke collections.",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NIRA Furniture - Premium Outdoor & Indoor Furniture",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "NIRA Furniture | Premium Outdoor & Indoor Furniture",

    description:
      "Premium outdoor and indoor furniture crafted in India. Explore luxury sofas, lounge chairs, dining furniture and bespoke furniture collections.",

    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",

    "@id": `${SITE_URL}/#organization`,

    name: "NIRA Furniture",

    url: SITE_URL,

    logo: `${SITE_URL}/nira-logo.png`,

    description:
      "NIRA Furniture manufactures premium outdoor and indoor furniture in India, including luxury outdoor sofas, lounge chairs, dining furniture and bespoke furniture.",

    brand: {
      "@type": "Brand",
      name: "NIRA Furniture",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",

    "@id": `${SITE_URL}/#website`,

    name: "NIRA Furniture",

    url: SITE_URL,

    description:
      "Premium outdoor and indoor furniture manufactured in India by NIRA Furniture.",

    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#eeeae4] text-[#181818] antialiased selection:bg-[#B88A2B] selection:text-white">
        <StructuredData />

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
 
