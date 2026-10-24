import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://reinvent.awslpu.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Re:Invent Fest 2026 | AWS Student Builder Group LPU",
    template: "%s | Re:Invent Fest 2026",
  },

  description:
    "Five days of technology, cloud computing, AI, and innovation at Re:Invent Fest 2026, hosted by AWS Student Builder Group at Lovely Professional University, Punjab, India, from November 30 to December 4, 2026.",

  applicationName: "Re:Invent Fest 2026",

  keywords: [
    "Re:Invent Fest 2026",
    "AWS Student Builder Group LPU",
    "AWS LPU",
    "Lovely Professional University",
    "LPU tech fest",
    "cloud computing event",
    "AI and innovation",
    "developer conference India",
    "technology festival Punjab",
    "student developer community",
    "Phagwara tech events",
  ],

  authors: [
    {
      name: "AWS Student Builder Group LPU",
      url: "https://awslpu.in",
    },
  ],

  creator: "AWS Student Builder Group LPU",
  publisher: "AWS Student Builder Group LPU",

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Re:Invent Fest 2026",
    title: "Re:Invent Fest 2026 | Build Beyond Limits",
    description:
      "A five-day celebration of cloud, AI, and technology at Lovely Professional University. November 30 – December 4, 2026.",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Re:Invent Fest 2026 — AWS Student Builder Group LPU",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Re:Invent Fest 2026 | Build Beyond Limits",
    description:
      "Five days. Bold ideas. Limitless innovation. November 30 – December 4, 2026, at LPU.",
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
  themeColor: "#080914",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}