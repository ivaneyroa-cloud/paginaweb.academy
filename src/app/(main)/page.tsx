import HeroSection from "@/components/landing/HeroSection";
import dynamic from "next/dynamic";

const WhyShipparSection = dynamic(() => import("@/components/landing/WhyShipparSection"), { ssr: true });
const HowItWorksSection = dynamic(() => import("@/components/landing/HowItWorksSection"), { ssr: true });
const TestimonialSection = dynamic(() => import("@/components/landing/TestimonialsSection"), { ssr: true });
const CTASection = dynamic(() => import("@/components/landing/CTASection"), { ssr: true });

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <WhyShipparSection />
            <HowItWorksSection />
            <TestimonialSection />
            <CTASection />
        </>
    );
}
