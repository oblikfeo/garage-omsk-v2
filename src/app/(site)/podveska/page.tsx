import LandingPage, { landingMetadata } from "@/components/LandingPage";

export const metadata = landingMetadata("podveska");

export default function Page() {
  return <LandingPage slug="podveska" />;
}
