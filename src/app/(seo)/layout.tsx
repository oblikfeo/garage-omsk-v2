import "./seo.css";
import YandexMetrika from "@/components/YandexMetrika";
import VkPixel from "@/components/VkPixel";
import PageViewHits from "@/components/PageViewHits";
import SeoHeader from "@/components/seo/SeoHeader";
import Goals from "@/components/seo/Goals";
import { MobileBar, SeoFooter } from "@/components/seo/ui";
import { getSeoContent } from "@/lib/seo/content";

/**
 * Layout of the SEO templates (geo, services, prices, contacts, articles,
 * text pages). The home page and the Direct landings keep the (site) layout.
 * Content is static: pages are rebuilt from content/ files on every build.
 */
export default function SeoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { site, services } = getSeoContent();

  return (
    <>
      <YandexMetrika />
      <VkPixel />
      <PageViewHits />
      <Goals />
      <SeoHeader
        data={{
          name: site.name,
          address: site.address,
          hours: site.hours,
          phone: site.phone,
          phoneHref: site.phone_href,
          telegram: site.telegram,
          max: site.max,
          bookingUrl: site.booking_url,
          services: services.map((s) => ({ slug: s.slug, name: s.name })),
        }}
      />
      <main className="flex-1">{children}</main>
      <SeoFooter site={site} />
      <MobileBar site={site} />
    </>
  );
}
