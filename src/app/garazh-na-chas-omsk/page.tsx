import type { Metadata } from "next";
import Services from "@/components/Services";
import PriceList from "@/components/PriceList";
import HowItWorks from "@/components/HowItWorks";
import SeoHero from "@/components/SeoHero";
import Faq from "@/components/Faq";
import Contacts from "@/components/Contacts";

export const metadata: Metadata = {
  title: "Гараж на час в Омске — почасовая аренда бокса с подъёмником",
  description:
    "Гараж на час в Омске: почасовая аренда бокса, ямы и подъёмника для мелкого и среднего ремонта автомобиля. Онлайн-бронь, без очередей, работаем ежедневно.",
  alternates: { canonical: "/garazh-na-chas-omsk" },
};

const pageFaq = [
  {
    q: "Можно ли арендовать гараж на час без предоплаты?",
    a: "Да, для брони на текущий день доступна оплата на месте. Для брони на популярное время (вечер, выходные) рекомендуем предоплату 30%, чтобы место точно осталось за вами.",
  },
  {
    q: "Какой минимальный срок аренды гаража на час?",
    a: "Минимальная бронь — 1 час. Дальше можно продлить прямо на месте, если пост свободен.",
  },
  {
    q: "Есть ли скидка при аренде гаража на несколько часов подряд?",
    a: "Да, при бронировании от 4 часов действует сниженный часовой тариф — расчёт итоговой суммы виден сразу в форме онлайн-записи.",
  },
];

export default function GarazhNaChasOmsk() {
  return (
    <>
      <SeoHero
        eyebrow="Гараж на час Омск"
        h1="Гараж на час в Омске — быстрая аренда бокса"
        intro="Нужно на пару часов заехать заменить масло, колодки или подвеску? Берите пост с ямой или подъёмником на час — без абонементов и очереди в сервис."
        bullets={["От 1 часа", "Онлайн-бронь", "Работаем ежедневно"]}
      />
      <Services />
      <PriceList />
      <HowItWorks />
      <Faq id="faq-garazh" title="Вопросы о гараже на час" items={pageFaq} />
      <Contacts />
    </>
  );
}
