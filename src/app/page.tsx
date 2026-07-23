import Hero from "@/components/Hero";
import Services from "@/components/Services";
import PriceList from "@/components/PriceList";
import HowItWorks from "@/components/HowItWorks";
import Safety from "@/components/Safety";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import BookingSection from "@/components/BookingSection";
import Contacts from "@/components/Contacts";
import { site } from "@/lib/data";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    name: site.fullName,
    image: "https://garage-omsk.example/logo.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: site.city,
      addressCountry: "RU",
    },
    telephone: site.phone,
    openingHours: "Mo-Su 08:00-23:00",
    priceRange: "₽₽",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Services />
      <PriceList />
      <HowItWorks />
      <Safety />
      <Testimonials />
      <BookingSection />
      <Faq />
      <Contacts />
    </>
  );
}
