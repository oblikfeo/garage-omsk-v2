import LandingPage, { landingMetadata } from "@/components/LandingPage";

export const metadata = landingMetadata("tormoza");

export default function Page() {
  return <LandingPage slug="tormoza" />;
}
