import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shippar.net"),
  title: {
    default: "Shippar — Logística Internacional, Courier Express y Freight Forwarder",
    template: "%s | Shippar",
  },
  description:
    "Importá productos, materias primas y mercadería desde China, USA y Europa a Argentina. Courier express, flete marítimo, gestión aduanera y la mejor cotización de Argentina. Seguimiento en tiempo real.",
  keywords: [
    "importar desde china",
    "importaciones argentina",
    "courier internacional",
    "freight forwarder",
    "flete internacional",
    "logística internacional",
    "envío express china argentina",
    "gestión aduanera",
    "importar mercadería",
    "carga marítima argentina",
    "rastreo de envíos",
    "Shippar",
  ],
  authors: [{ name: "Shippar Global Logistics" }],
  creator: "Shippar",
  publisher: "Shippar Global Logistics",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Shippar — Logística Internacional para Negocios que Importan",
    description:
      "Courier express, flete marítimo y gestión aduanera. Importá desde cualquier parte del mundo con seguimiento en tiempo real y la mejor cotización de Argentina.",
    url: "https://shippar.net",
    siteName: "Shippar",
    locale: "es_AR",
    alternateLocale: "en_US",
    type: "website",
    images: [
      {
        url: "/shippar-icon.png",
        width: 1024,
        height: 1024,
        alt: "Shippar — Logística Internacional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shippar — Logística Internacional para Negocios que Importan",
    description:
      "Courier express, flete marítimo y gestión aduanera. Importá desde cualquier parte del mundo a Argentina.",
    images: ["/shippar-icon.png"],
  },
  alternates: {
    canonical: "https://shippar.net",
    languages: {
      es: "https://shippar.net",
      en: "https://shippar.net/en",
    },
  },
  other: {
    "google-site-verification": "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

