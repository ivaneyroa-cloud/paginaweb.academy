"use client";

import { Inter } from "next/font/google";
import Navbar from "@/shared/components/Navbar";
import Footer from "@/shared/components/Footer";
import { DataTransferProvider } from "@/shared/context/DataTransferContext";
import { ThemeProvider } from "@/shared/context/ThemeContext";
import WhatsAppButton from "@/shared/components/WhatsAppButton";
import "@/styles/cotizador.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function CotizadorLayout({ children }) {
  return (
    <div className={`cotizador-scope ${inter.variable} ${inter.className}`} data-theme="light">
      <ThemeProvider>
        <DataTransferProvider>
          {/* Subtle background pattern */}
          <div className="ctz-bg-pattern">
            <div className="ctz-bg-dots" />
            <div className="ctz-bg-glow" />
          </div>

          <Navbar />
          <main className="flex-grow pt-16 min-h-screen">
            {children}
          </main>
          <WhatsAppButton />
          <Footer />
        </DataTransferProvider>
      </ThemeProvider>
    </div>
  );
}
