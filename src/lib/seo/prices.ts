import type { ServicePage, SiteData } from "./content";

/**
 * Service prices are computed at build time from site.json rates:
 * "сами от"        = hours_self.min × rate[station]
 * "с мастером от"  = hours_master.min × (rate[station] + master)   master_mode "on_top"
 *                  = hours_master.min × master                      master_mode "instead"
 */
export function servicePrices(service: ServicePage, site: SiteData) {
  const rate = site.rates[service.station];
  const self = Math.round(service.hours_self[0] * rate);
  const master = service.hours_master
    ? Math.round(
        service.hours_master[0] *
          (site.master_mode === "on_top" ? rate + site.rates.master : site.rates.master)
      )
    : undefined;
  return { rate, self, master };
}

export const rub = (n: number) => `${n.toLocaleString("ru-RU")} ₽`;

export const STATION_LABEL: Record<ServicePage["station"], string> = {
  post: "пост",
  lift: "подъёмник",
  machine: "шиномонтажный станок",
};

export const COMPLEXITY_LABEL: Record<1 | 2 | 3, string> = {
  1: "Просто",
  2: "Средне",
  3: "Сложно",
};

export function hoursLabel([min, max]: [number, number]): string {
  const fmt = (h: number) => (Number.isInteger(h) ? String(h) : String(h).replace(".", ","));
  return min === max ? `${fmt(min)} ч` : `${fmt(min)}–${fmt(max)} ч`;
}
