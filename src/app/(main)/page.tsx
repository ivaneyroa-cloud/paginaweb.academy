import HeroSection from "@/components/landing/HeroSection";
import WhyShipparSection from "@/components/landing/WhyShipparSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";

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
