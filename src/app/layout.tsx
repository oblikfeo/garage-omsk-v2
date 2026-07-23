import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/data";
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

export const metadata: Metadata = {
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${oswald.variable}`}>
      <body className="flex min-h-dvh flex-col bg-graphite font-sans text-offwhite antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
