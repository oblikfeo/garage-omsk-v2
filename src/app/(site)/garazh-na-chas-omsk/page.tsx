import type { Metadata } from "next";
import Services from "@/components/Services";
import PriceList from "@/components/PriceList";
import HowItWorks from "@/components/HowItWorks";
import SeoHero from "@/components/SeoHero";
import Faq from "@/components/Faq";
import Contacts from "@/components/Contacts";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getContent();
  const page = pages.garazh;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: "/garazh-na-chas-omsk" },
  };
}

export default async function GarazhNaChasOmsk() {
  const { pages, sections, steps } = await getContent();
  const page = pages.garazh;

  return (
    <>
      <SeoHero
        eyebrow={page.eyebrow}
        h1={page.h1}
        intro={page.intro}
        bullets={page.bullets}
      />
      <Services />
      <PriceList />
      <HowItWorks items={steps} heading={sections.how} />
      <Faq
        id="faq-garazh"
        eyebrow={sections.faq.eyebrow}
        title={page.faqTitle}
        items={page.faq}
      />
      <Contacts />
    </>
  );
}
