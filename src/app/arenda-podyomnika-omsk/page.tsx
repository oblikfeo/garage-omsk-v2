import type { Metadata } from "next";
import Services from "@/components/Services";
import PriceList from "@/components/PriceList";
import HowItWorks from "@/components/HowItWorks";
import SeoHero from "@/components/SeoHero";
import Faq from "@/components/Faq";
import Contacts from "@/components/Contacts";

export const metadata: Metadata = {
  title: "Аренда подъёмника в Омске — почасово и посуточно",
  description:
    "Аренда автомобильного подъёмника в Омске: двухстоечный и ножничный, почасово и посуточно. Полный доступ к днищу и подвеске, инструктаж перед работой.",
  alternates: { canonical: "/arenda-podyomnika-omsk" },
};

const pageFaq = [
  {
    q: "Какой подъёмник выбрать для замены подвески?",
    a: "Для работ с подвеской, тормозами и защитой днища удобнее двухстоечный подъёмник — он даёт полный доступ снизу и грузоподъёмность до 4 тонн.",
  },
  {
    q: "Чем ножничный подъёмник отличается от двухстоечного?",
    a: "Ножничный подъёмник поднимается быстрее и занимает меньше места — хорошо подходит для шиномонтажа и несложных работ с колёсами и тормозами.",
  },
  {
    q: "Нужен ли опыт работы с подъёмником?",
    a: "Перед началом администратор проводит короткий инструктаж по технике безопасности и правилам подъёма автомобиля — этого достаточно для самостоятельной работы.",
  },
];

export default function ArendaPodyomnikaOmsk() {
  return (
    <>
      <SeoHero
        eyebrow="Аренда подъёмника Омск"
        h1="Аренда подъёмника в Омске: 2-стоечный и ножничный"
        intro="Полный доступ к днищу, подвеске и тормозной системе — без записи в очередь на сервисный подъёмник. Берите на час или на сутки, оплата по факту использования."
        bullets={["До 4 тонн", "2-стоечный и ножничный", "Инструктаж перед подъёмом"]}
      />
      <Services />
      <PriceList />
      <HowItWorks />
      <Faq id="faq-podyomnik" title="Вопросы об аренде подъёмника" items={pageFaq} />
      <Contacts />
    </>
  );
}
