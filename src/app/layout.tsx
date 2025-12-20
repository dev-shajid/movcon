import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { OverlayProvider } from "@/hooks/use-overlay";
import NextTopLoader from 'nextjs-toploader';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SOP & Duty Manuals",
  description: "Military Operations Management System",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressContentEditableWarning
      suppressHydrationWarning
      lang="en"
    >
      <body
        suppressHydrationWarning
        suppressContentEditableWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <OverlayProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader
              color="var(--primary)"
              crawlSpeed={200}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
            />
            <Toaster />
            {children}
          </ThemeProvider>
        </OverlayProvider>
      </body>
    </html>
  );
}
