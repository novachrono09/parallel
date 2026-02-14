import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "PARALLEL — Explore the Lives You Never Lived",
  description: "Describe a life decision. Watch three alternate futures unfold. See the lives you never lived.",
  keywords: ["life simulation", "alternate history", "decision making", "AI", "timeline", "what if"],
  authors: [{ name: "PARALLEL" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌀</text></svg>",
  },
  openGraph: {
    title: "PARALLEL — Alternate Life Path Simulator",
    description: "Every choice opens doors we'll never see closed. Peek through a few.",
    type: "website",
    siteName: "PARALLEL",
  },
  twitter: {
    card: "summary_large_image",
    title: "PARALLEL",
    description: "Explore the lives you never lived.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
