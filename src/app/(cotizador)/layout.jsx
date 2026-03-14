"use client";

import { Inter } from "next/font/google";
import Navbar from "@/shared/components/Navbar";
import Footer from "@/shared/components/Footer";
import { DataTransferProvider } from "@/shared/context/DataTransferContext";
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
      <DataTransferProvider>
        {/* Subtle background pattern */}
        <div className="fixed inset-0 -z-10 h-full w-full" style={{ background: 'var(--ctz-bg-secondary)' }}>
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 rounded-full" 
            style={{ background: 'rgba(29, 161, 255, 0.04)', filter: 'blur(100px)' }}
          />
        </div>

        <Navbar />
        <main className="flex-grow pt-16 min-h-screen">
          {children}
        </main>
        <WhatsAppButton />
        <Footer />
      </DataTransferProvider>
    </div>
  );
}
