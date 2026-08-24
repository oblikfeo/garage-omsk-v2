import Link from "next/link";
import { getContent } from "@/lib/content";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import FadeIn from "./FadeIn";

export default async function PriceList() {
  const { priceList } = await getContent();

  return (
    <Section id="prices" variant="light" pattern="blueprint">
      <SectionHeading
        light
        eyebrow="Прайс-лист"
        title="Почасовая и посуточная аренда"
        description="Никаких скрытых доплат — итоговая цена всегда известна заранее. Оплата на месте или онлайн при бронировании."
      />

      {/* Mobile: stacked cards */}
      <ul className="mt-8 space-y-3 sm:hidden">
        {priceList.map((row, i) => (
          <FadeIn
            as="li"
            key={row.service}
            delay={i * 0.05}
            className="card-paper flex items-center justify-between gap-3 rounded-xl border border-graphite/10 bg-offwhite px-4 py-3.5"
          >
            <span className="text-sm font-medium text-graphite-deep">
              {row.service}
            </span>
            <span className="flex shrink-0 flex-col items-end gap-0.5 text-right">
              <span className="text-sm font-semibold text-orange-dark">
                {row.hour.toLocaleString("ru-RU")} ₽<span className="font-normal text-steel">/час</span>
              </span>
              <span className="text-xs font-semibold text-blue">
                {row.day.toLocaleString("ru-RU")} ₽<span className="font-normal text-steel">/сутки</span>
              </span>
            </span>
          </FadeIn>
        ))}
      </ul>

      {/* Desktop / tablet: table */}
      <FadeIn
        delay={0.1}
        className="card-paper mt-10 hidden overflow-hidden rounded-2xl border border-graphite/10 bg-offwhite shadow-lg shadow-graphite/5 sm:block"
      >
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-graphite/10 bg-graphite-deep text-offwhite">
              <th className="px-6 py-4 font-display text-sm font-semibold uppercase tracking-wide">
                Услуга
              </th>
              <th className="px-6 py-4 font-display text-sm font-semibold uppercase tracking-wide">
                1 час
              </th>
              <th className="px-6 py-4 font-display text-sm font-semibold uppercase tracking-wide">
                Сутки
              </th>
            </tr>
          </thead>
          <tbody>
            {priceList.map((row, i) => (
              <tr
                key={row.service}
                className={`transition-colors duration-200 hover:bg-orange/10 ${
                  i % 2 === 0 ? "bg-offwhite" : "bg-light/60"
                }`}
              >
                <td className="px-6 py-4 text-sm font-medium text-graphite-deep">
                  {row.service}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-orange-dark">
                  {row.hour.toLocaleString("ru-RU")} ₽
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-blue">
                  {row.day.toLocaleString("ru-RU")} ₽
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </FadeIn>

      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-sm text-steel">
          Для длительной аренды (от 3 суток) и корпоративных клиентов —
          индивидуальные условия. Уточняйте у администратора.
        </p>
        <Link
          href="#booking"
          className="whitespace-nowrap rounded-xl bg-graphite-deep px-6 py-3.5 text-sm font-semibold text-offwhite transition-all duration-300 hover:-translate-y-0.5 hover:bg-graphite hover:shadow-lg active:translate-y-0"
        >
          Выбрать пост и время
        </Link>
      </div>
    </Section>
  );
}
