import type { Metadata } from "next";
import HomePage from "./HomePage";
import { landings, type LandingSlug } from "@/lib/landings";

/** <title> and description of an ad landing, taken from its heading. */
export function landingMetadata(slug: LandingSlug): Metadata {
  const page = landings[slug];

  return {
    title: [page.titleBefore, page.titleAccent, page.titleAfter].filter(Boolean).join(" "),
    description: page.text,
    // Ad copies of the home page: search engines should index the home page only.
    alternates: { canonical: "/" },
  };
}

/** The home page with this landing's first-screen heading and subtitle. */
export default function LandingPage({ slug }: { slug: LandingSlug }) {
  return <HomePage heroOverride={landings[slug]} />;
}
