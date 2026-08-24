import type { Metadata } from "next";
import Services from "@/components/Services";
import PriceList from "@/components/PriceList";
import HowItWorks from "@/components/HowItWorks";
import SeoHero from "@/components/SeoHero";
import Faq from "@/components/Faq";
import Contacts from "@/components/Contacts";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "СТО самообслуживания в Омске — аренда постов и подъёмников",
  description:
    "СТО самообслуживания в Омске: аренда постов, подъёмников и шиномонтажного станка почасово и посуточно. Онлайн-запись, инструктаж по безопасности, понятный прайс.",
  alternates: { canonical: "/sto-samoobsluzhivaniya-omsk" },
};

const pageFaq = [
  {
    q: "Чем СТО самообслуживания отличается от обычного автосервиса?",
    a: "Вы арендуете пост, подъёмник и инструмент и выполняете ремонт своими руками — без наценки за работу мастера. Персонал только выдаёт оборудование и проводит инструктаж.",
  },
  {
    q: "Подходит ли СТО самообслуживания новичкам?",
    a: "Да, для несложных операций (замена масла, фильтров, колодок) администратор подскажет по инструменту. Для сложного ремонта рекомендуем иметь базовый опыт или взять консультацию мастера.",
  },
  {
    q: "Работает ли СТО самообслуживания в Омске каждый день?",
    a: "Да, бокс открыт ежедневно с 09:00 до 19:00, включая праздничные дни.",
  },
];

export default async function StoSamoobsluzhivaniyaOmsk() {
  const { steps } = await getContent();

  return (
    <>
      <SeoHero
        eyebrow="СТО самообслуживания Омск"
        h1="СТО самообслуживания в Омске: пост и подъёмник в аренду"
        intro="Работайте на профессиональном оборудовании сами и платите только за время на посту — без наценки за услуги мастера. Подъёмники, шиномонтаж и весь нужный инструмент уже на месте."
        bullets={["Без абонементов", "Оплата по факту", "Инструктаж включён"]}
      />
      <Services />
      <PriceList />
      <HowItWorks items={steps} />
      <Faq id="faq-sto" title="Вопросы о СТО самообслуживания" items={pageFaq} />
      <Contacts />
    </>
  );
}
