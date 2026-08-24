import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { getContent } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  variable: "--font-oswald",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();

  return {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${site.fullName} в Омске — аренда постов, подъёмников и шиномонтажа`,
    template: `%s | ${site.fullName} Омск`,
  },
  description:
    "Почасовая и посуточная аренда постов, подъёмников и шиномонтажного оборудования в Омске. Онлайн-запись, понятный прайс, инструктаж по безопасности.",
  keywords: [
    "СТО самообслуживания Омск",
    "гараж на час Омск",
    "аренда подъемника Омск",
    "аренда поста Омск",
    "шиномонтаж самообслуживания Омск",
  ],
  openGraph: {
    title: `${site.fullName} в Омске`,
    description:
      "Аренда постов, подъёмников и шиномонтажа почасово и посуточно. Онлайн-запись за 2 минуты.",
    locale: "ru_RU",
    type: "website",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg" }],
  },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${oswald.variable}`}>
      <body className="flex min-h-dvh flex-col bg-graphite font-sans text-offwhite antialiased">
        {children}
      </body>
    </html>
  );
}
