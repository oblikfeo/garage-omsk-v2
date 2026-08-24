import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Админка",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="flex min-h-dvh flex-col bg-graphite-deep">{children}</div>;
}
