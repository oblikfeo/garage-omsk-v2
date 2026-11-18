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
import type { Landing } from "@/lib/landings";
import { getSiteUrl } from "@/lib/site-url";

/**
 * The home page body. Ad landings (/zamena-masla etc.) render the same page
 * and only swap the first-screen heading and the line under it.
 */
export default async function HomePage({ heroOverride }: { heroOverride?: Landing }) {
  const { site, hero, gallery, steps, faq, sections, texts } = await getContent();
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
      <Hero site={site} hero={heroOverride ? { ...hero, ...heroOverride } : hero} />
      <Services />
      <PriceList />
      <Gallery
        items={gallery}
        heading={sections.gallery}
        planTitle={texts.planTitle}
        planText={texts.planText}
        planViewerCaption={texts.planViewerCaption}
      />
      <HowItWorks items={steps} heading={sections.how} />
      <Safety />
      <Testimonials />
      <BookingSection />
      <Faq items={faq} eyebrow={sections.faq.eyebrow} title={sections.faq.title} />
      <Contacts />
    </>
  );
}
