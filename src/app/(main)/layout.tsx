import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import WhatsAppFloat from "@/components/landing/WhatsAppFloat";
import TrackingWidget from "@/components/landing/TrackingWidget";
import I18nWrapper from "@/components/I18nWrapper";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <I18nWrapper>
            <Navbar />
            <main className="min-h-screen relative">
                <div className="relative" style={{ zIndex: 1 }}>
                    {children}
                </div>
            </main>
            <Footer />
            <WhatsAppFloat />
            <TrackingWidget />
        </I18nWrapper>
    );
}

