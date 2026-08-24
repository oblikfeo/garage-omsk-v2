import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import type { SiteInfo } from "@/lib/content-types";

export const metadata: Metadata = {
  title: "Политика обработки персональных данных",
  description:
    "Политика обработки персональных данных посетителей сайта Гараж самообслуживания в Омске.",
  robots: { index: false, follow: true },
};

function buildSections(site: SiteInfo) {
  return [
  {
    title: "1. Общие положения",
    text: `Настоящая политика определяет порядок обработки персональных данных пользователей сайта ${site.fullName} (далее — «Оператор»). Используя формы онлайн-записи на сайте, пользователь даёт согласие на обработку своих персональных данных на условиях, изложенных ниже.`,
  },
  {
    title: "2. Какие данные обрабатываются",
    text: "Оператор обрабатывает данные, которые пользователь указывает самостоятельно при заполнении формы онлайн-записи: имя, номер телефона и комментарий к заявке.",
  },
  {
    title: "3. Цели обработки",
    text: "Персональные данные обрабатываются для связи с клиентом с целью подтверждения брони поста, подъёмника или оборудования, информирования об изменениях в записи и оказания консультаций.",
  },
  {
    title: "4. Способы обработки",
    text: "Обработка данных осуществляется с использованием средств автоматизации и без таковых: сбор, запись, систематизация, хранение, уточнение и уничтожение персональных данных.",
  },
  {
    title: "5. Срок хранения",
    text: "Персональные данные хранятся не дольше срока, необходимого для целей их обработки, либо до отзыва согласия пользователем.",
  },
  {
    title: "6. Права пользователя",
    text: "Пользователь вправе в любой момент отозвать согласие на обработку персональных данных, направив запрос на электронную почту оператора.",
  },
  {
    title: "7. Контакты",
    text: `По вопросам обработки персональных данных обращайтесь по телефону ${site.phone} или на почту ${site.email}.`,
  },
  ];
}

export default async function PrivacyPolicyPage() {
  const { site } = await getContent();
  const sections = buildSections(site);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">
        Юридическая информация
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-offwhite sm:text-4xl">
        Политика обработки персональных данных
      </h1>
      <p className="mt-4 text-sm text-muted">
        Действует для всех форм онлайн-записи на сайте {site.fullName}, {site.city}.
      </p>

      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="font-display text-lg font-semibold text-offwhite">
              {s.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
