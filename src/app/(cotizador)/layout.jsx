"use client";

import Navbar from "@/shared/components/Navbar";
import Footer from "@/shared/components/Footer";
import { DataTransferProvider } from "@/shared/context/DataTransferContext";
import WhatsAppButton from "@/shared/components/WhatsAppButton";

export default function CotizadorLayout({ children }) {
  return (
    <DataTransferProvider>
      {/* Background global del cotizador */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-slate-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-sky-200/40 blur-[100px] rounded-full"></div>
      </div>
      <Navbar />
      <main className="flex-grow py-6 pt-16">
        {children}
      </main>
      <WhatsAppButton />
      <Footer />
    </DataTransferProvider>
  );
}
