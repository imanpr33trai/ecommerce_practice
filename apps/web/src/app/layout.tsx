import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata } from "next";
import "../index.css";

import Footer from "@/components/Footer";
import ModalCompare from "@/components/ModalCompare";
import Navbar from "@/components/Navbar";
import Providers from "@/components/providers";

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
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={`${jakartaSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="flex flex-col min-h-screen bg-nest-bg text-nest-text font-sans selection:bg-black selection:text-white">
            <Navbar />
            <main className="flex-1 w-full relative">
              {modal}
              {children}
            </main>
            <Footer />

            <ModalCompare />
          </div>
        </Providers>
      </body>
    </html>
  );
}
