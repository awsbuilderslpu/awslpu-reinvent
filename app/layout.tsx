import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AuthProvider } from "@/providers/auth-provider";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL("https://reinvent.awslpu.in"),

  title: {
    default: "Re:Invent Fest 2026 | AWS Student Builder Group LPU",
    template: "%s | Re:Invent Fest 2026",
  },

  description:
    "Re:Invent Fest 2026 is a five-day technology festival hosted by AWS Student Builder Group at Lovely Professional University, Punjab, from November 30 to December 4, 2026.",

  applicationName: "Re:Invent Fest 2026",

  keywords: [
    "Re:Invent Fest 2026",
    "AWS reInvent LPU",
    "AWS Student Builder Group",
    "AWS Student Builder Group LPU",
    "Lovely Professional University tech fest",
    "LPU tech fest 2026",
    "cloud computing festival India",
    "AWS hackathon Punjab",
    "student tech festival Punjab",
    "AWS workshops for students",
  ],

  authors: [{ name: "AWS Student Builder Group LPU", url: "https://reinvent.awslpu.in" }],
  creator: "AWS Student Builder Group LPU",
  publisher: "AWS Student Builder Group LPU",

  alternates: {
    canonical: "/",
  },

  // Paste the token from Google Search Console (HTML tag method) into
  // GOOGLE_SITE_VERIFICATION to verify ownership of the domain.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,

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
    <html lang="en" className="font-sans">
      <head>
        <script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        />
      </head>
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <ScrollReveal />
        </AuthProvider>
      </body>
    </html>
  );
}
