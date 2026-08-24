import Hero from "@/components/Hero";
import Services from "@/components/Services";
import PriceList from "@/components/PriceList";
import Gallery from "@/components/Gallery";
import HowItWorks from "@/components/HowItWorks";
import Safety from "@/components/Safety";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import BookingSection from "@/components/BookingSection";
import Contacts from "@/components/Contacts";
import { getContent } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

export default async function Home() {
  const { site, gallery, steps, faq } = await getContent();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    name: site.fullName,
    image: `${getSiteUrl()}/logo.svg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: site.city,
      addressCountry: "RU",
    },
    telephone: site.phone,
    openingHours: site.hoursSchema,
    priceRange: "₽₽",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero site={site} />
      <Services />
      <PriceList />
      <Gallery items={gallery} />
      <HowItWorks items={steps} />
      <Safety />
      <Testimonials />
      <BookingSection />
      <Faq items={faq} />
      <Contacts />
    </>
  );
}
