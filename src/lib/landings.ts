import type { HeroContent } from "./content-types";

/**
 * Ad landing pages (/zamena-masla etc.): full copies of the home page that
 * differ only in the first-screen heading and the line under it. Everything
 * else comes from the home page content, so editing the home page in the
 * admin panel updates every landing as well.
 *
 * The heading is split like the home one: the middle part is shown in orange.
 */
export type Landing = Pick<HeroContent, "titleBefore" | "titleAccent" | "titleAfter" | "text">;

export const landings = {
  "zamena-masla": {
    titleBefore: "Замените масло сами —",
    titleAccent: "дешевле, чем в сервисе",
    titleAfter: "",
    text: "Подъёмник от 600 ₽/час, инструмент включён, слив отработки — у нас",
  },
  "maslo-korobka": {
    titleBefore: "Масло в АКПП, вариаторе и коробке —",
    titleAccent: "меняйте сами",
    titleAfter: "",
    text: "Подъёмник от 600 ₽/час, ёмкости для слива, приём отработки",
  },
  tormoza: {
    titleBefore: "Колодки и тормозные диски —",
    titleAccent: "поменяйте сами за час",
    titleAfter: "",
    text: "Подъёмник от 600 ₽/час, ключи и съёмники. Свои запчасти — без наценки сервиса",
  },
  podveska: {
    titleBefore: "Ремонт подвески",
    titleAccent: "своими руками",
    titleAfter: "на подъёмнике",
    text: "Подъёмник от 600 ₽/час, прокат съёмников, консультация мастера",
  },
  shinomontazh: {
    titleBefore: "Переобуйтесь сами —",
    titleAccent: "шиномонтаж своими руками",
    titleAfter: "",
    text: "Станок и балансировка — 500 ₽/час. Не хотите сами — сделает мастер",
  },
  "dvigatel-transmissiya": {
    titleBefore: "ГРМ, сцепление, глушитель —",
    titleAccent: "сделайте сами",
    titleAfter: "",
    text: "Подъёмник от 600 ₽/час, прокат инструмента, консультация мастера",
  },
  "arenda-garazha": {
    titleBefore: "Не снимайте гараж на месяц —",
    titleAccent: "арендуйте на час",
    titleAfter: "",
    text: "Тёплый бокс: пост от 400 ₽/час, сутки от 2 700 ₽",
  },
} satisfies Record<string, Landing>;

export type LandingSlug = keyof typeof landings;
