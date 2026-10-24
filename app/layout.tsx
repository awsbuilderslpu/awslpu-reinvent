import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { cn } from "@/lib/utils";

const amazonEmber = localFont({
  src: [
    {
      path: "./fonts/AmazonEmber_Lt.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/AmazonEmber_Rg.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Amazon-Ember-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/AmazonEmber_Bd.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-amazon-ember",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://reinvent.awslpu.in"),

  title: {
    default: "Re:Invent Fest 2026 | AWS Student Builder Group LPU",
    template: "%s | Re:Invent Fest 2026",
  },

  description:
    "Re:Invent Fest 2026 is a five-day technology festival hosted by AWS Student Builder Group at Lovely Professional University, Punjab, from November 30 to December 4, 2026.",

  applicationName: "Re:Invent Fest 2026",

  openGraph: {
    type: "website",
    url: "https://reinvent.awslpu.in",
    siteName: "Re:Invent Fest 2026",
    title: "Re:Invent Fest 2026",
    description:
      "November 30 - December 4, 2026 · Lovely Professional University, Punjab.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Re:Invent Fest 2026 at Lovely Professional University",
      },
    ],
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    title: "Re:Invent Fest 2026",
    description:
      "A five-day technology festival at Lovely Professional University, November 30 – December 4, 2026.",
    images: ["/og-image.png"],
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

  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(amazonEmber.variable, "font-sans")}>
      <body className="min-h-screen antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}