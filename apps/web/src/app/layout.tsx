import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "../index.css";
// import Header from "@/_components/Layout/Header";
import Providers from "@/_components/providers";
import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";
import ModalCompare from "@/components/ModalCompare";
import ModalQuickView from "@/components/ModalQuickView";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ecomerceNextjs",
  description: "ecomerceNextjs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jakartaSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="flex flex-col min-h-screen bg-nest-bg text-nest-text font-sans selection:bg-black selection:text-white">
            <Navbar />
            <main className="flex-1 w-full relative">{children}</main>
            <Footer />

            <ModalQuickView />
            <ModalCompare />
          </div>
        </Providers>
      </body>
    </html>
  );
}
