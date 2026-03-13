import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import WhatsAppFloat from "@/components/landing/WhatsAppFloat";
import TrackingWidget from "@/components/landing/TrackingWidget";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main className="min-h-screen relative">
                <div className="relative" style={{ zIndex: 1 }}>
                    {children}
                </div>
            </main>
            <Footer />
            <WhatsAppFloat />
            <TrackingWidget />
        </>
    );
}

