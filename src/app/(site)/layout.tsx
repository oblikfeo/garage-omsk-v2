import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteNoticeWidget from "@/components/SiteNotice";
import YandexMetrika from "@/components/YandexMetrika";
import VkPixel from "@/components/VkPixel";
import PageViewHits from "@/components/PageViewHits";
import SameHashScroll from "@/components/SameHashScroll";
import { getContent } from "@/lib/content";

/**
 * Pages stay static and are re-rendered instantly when the admin panel saves
 * (revalidatePath). The interval is the safety net: after a fresh deploy the
 * build-time HTML is replaced by content.json within a minute even if nobody
 * touches the panel.
 */
export const revalidate = 60;

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { site, notice } = await getContent();

  return (
    <>
      {/* Counters go first so they load as early as possible. */}
      <YandexMetrika />
      <VkPixel />
      <PageViewHits />
      <SameHashScroll />
      <Header site={site} />
      <main className="flex-1">{children}</main>
      <Footer />
      <SiteNoticeWidget notice={notice} />
    </>
  );
}
