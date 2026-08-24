import type { Metadata } from "next";
import Services from "@/components/Services";
import PriceList from "@/components/PriceList";
import HowItWorks from "@/components/HowItWorks";
import SeoHero from "@/components/SeoHero";
import Faq from "@/components/Faq";
import Contacts from "@/components/Contacts";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Аренда подъёмника в Омске — почасово и посуточно",
  description:
    "Аренда автомобильного подъёмника в Омске: двухстоечный и 4-стоечный под сход-развал, почасово и посуточно. Полный доступ к днищу и подвеске, инструктаж перед работой.",
  alternates: { canonical: "/arenda-podyomnika-omsk" },
};

const pageFaq = [
  {
    q: "Какой подъёмник выбрать для замены подвески?",
    a: "Для работ с подвеской, тормозами и защитой днища удобнее двухстоечный подъёмник — он даёт полный доступ снизу и грузоподъёмность до 4 тонн.",
  },
  {
    q: "Чем 4-стоечный подъёмник отличается от двухстоечного?",
    a: "Четырёхстоечный держит авто на платформе и удобен для сход-развала и работ с ходовой. Двухстоечный даёт свободный доступ снизу — для подвески, днища и тормозов.",
  },
  {
    q: "Нужен ли опыт работы с подъёмником?",
    a: "Перед началом администратор проводит короткий инструктаж по технике безопасности и правилам подъёма автомобиля — этого достаточно для самостоятельной работы.",
  },
];

export default async function ArendaPodyomnikaOmsk() {
  const { steps } = await getContent();

  return (
    <>
      <SeoHero
        eyebrow="Аренда подъёмника Омск"
        h1="Аренда подъёмника в Омске: 2-стоечный и 4-стоечный"
        intro="Полный доступ к днищу, подвеске и тормозной системе — без записи в очередь на сервисный подъёмник. Берите на час или на сутки, оплата по факту использования."
        bullets={["До 4 тонн", "2-стоечный и 4-стоечный", "Инструктаж перед подъёмом"]}
      />
      <Services />
      <PriceList />
      <HowItWorks items={steps} />
      <Faq id="faq-podyomnik" title="Вопросы об аренде подъёмника" items={pageFaq} />
      <Contacts />
    </>
  );
}
