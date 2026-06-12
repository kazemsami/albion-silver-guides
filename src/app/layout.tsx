import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MarketCityProvider } from "@/components/MarketCityProvider";
import { FeedbackProvider } from "@/components/FeedbackDialog";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { ThemeScript } from "@/components/ThemeScript";
import {
  defaultOgImage,
  siteDescription,
  siteKeywords,
  siteName,
  siteTitle,
  siteUrl,
} from "@/lib/site";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  category: "Games",
  keywords: siteKeywords,
  authors: [{ name: siteName }],
  creator: siteName,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName,
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
    images: [defaultOgImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-icon.png",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${inter.variable} h-full antialiased`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body className="relative flex min-h-full flex-col">
        <ThemeScript />
        <GoogleAnalytics />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-accent"
        >
          Skip to content
        </a>
        <MarketCityProvider>
          <FeedbackProvider>
            <Header />
            <main id="main-content" className="relative z-10 flex-1">
              {children}
            </main>
            <Footer />
          </FeedbackProvider>
        </MarketCityProvider>
      </body>
    </html>
  );
}
