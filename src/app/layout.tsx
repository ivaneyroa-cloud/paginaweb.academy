import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Shippar — Importaciones Express de China, USA y Europa a Argentina",
    template: "%s | Shippar",
  },
  description:
    "Importá productos desde China, Estados Unidos y Europa con envíos express en 5 días. Seguimiento en tiempo real, gestión aduanera y cotización en 30 segundos.",
  keywords: [
    "importar desde china",
    "importaciones argentina",
    "envío express",
    "logística internacional",
    "Shippar",
  ],
  authors: [{ name: "Shippar Global Logistics" }],
  openGraph: {
    title: "Shippar — Importaciones Express a Argentina",
    description:
      "De China a tu puerta en 5 días. Cotización en 30 segundos.",
    url: "https://shippar.net",
    siteName: "Shippar",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
