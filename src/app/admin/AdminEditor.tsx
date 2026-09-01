"use client";
/* eslint-disable @next/next/no-img-element */

import { useRef, useState, useTransition } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ExternalLink,
  Loader2,
  LogOut,
  Plus,
  RotateCcw,
  Power,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

import type {
  FaqItem,
  GalleryItem,
  PriceRow,
  Service,
  SiteContent,
  SiteInfo,
  SiteNotice,
  Testimonial,
  TitleText,
} from "@/lib/content-types";
import {
  logoutAction,
  resetContentAction,
  saveContentAction,
  uploadImageAction,
} from "./actions";

/* ------------------------------------------------------------------ */
/* small array helpers                                                 */
/* ------------------------------------------------------------------ */

const replaceAt = <T,>(arr: T[], i: number, next: T): T[] =>
  arr.map((item, index) => (index === i ? next : item));

const removeAt = <T,>(arr: T[], i: number): T[] =>
  arr.filter((_, index) => index !== i);

function moveAt<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [row] = next.splice(from, 1);
  next.splice(to, 0, row);
  return next;
}

/* ------------------------------------------------------------------ */
/* form primitives                                                     */
/* ------------------------------------------------------------------ */

const inputClass =
  "w-full rounded-lg border border-white/10 bg-graphite px-3 py-2.5 text-sm text-offwhite outline-none transition-colors focus:border-orange/60";

function Field({
  label,
  value,
  onChange,
  hint,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  hint?: string;
  type?: "text" | "number";
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 ${inputClass}`}
      />
      {hint && <span className="mt-1 block text-xs text-steel">{hint}</span>}
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 resize-y ${inputClass}`}
      />
    </label>
  );
}

/** Editor for a plain list of strings (service bullets, add-on services). */
function StringList({
  label,
  items,
  onChange,
  placeholder = "Новый пункт",
}: {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </span>
      <div className="mt-1.5 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => onChange(replaceAt(items, i, e.target.value))}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => onChange(removeAt(items, i))}
              aria-label="Удалить пункт"
              className="shrink-0 rounded-lg border border-white/10 px-3 text-muted transition-colors hover:border-red-500/40 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-white/15 px-3 py-2 text-xs font-semibold text-muted transition-colors hover:border-orange/40 hover:text-orange"
        >
          <Plus className="h-3.5 w-3.5" />
          {placeholder}
        </button>
      </div>
    </div>
  );
}

/** Generic add / reorder / delete wrapper around a list of records. */
function ListEditor<T>({
  items,
  onChange,
  blank,
  addLabel,
  rowTitle,
  renderRow,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  blank: () => T;
  addLabel: string;
  rowTitle: (item: T, index: number) => string;
  renderRow: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-2xl border border-white/10 bg-surface p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="truncate font-display text-sm font-semibold text-offwhite">
              {i + 1}. {rowTitle(item, i) || "Без названия"}
            </h3>
            <div className="flex shrink-0 gap-1.5">
              <button
                type="button"
                onClick={() => onChange(moveAt(items, i, i - 1))}
                disabled={i === 0}
                aria-label="Выше"
                className="rounded-lg border border-white/10 p-2 text-muted transition-colors hover:border-white/25 hover:text-offwhite disabled:opacity-30"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onChange(moveAt(items, i, i + 1))}
                disabled={i === items.length - 1}
                aria-label="Ниже"
                className="rounded-lg border border-white/10 p-2 text-muted transition-colors hover:border-white/25 hover:text-offwhite disabled:opacity-30"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onChange(removeAt(items, i))}
                aria-label="Удалить"
                className="rounded-lg border border-white/10 p-2 text-muted transition-colors hover:border-red-500/40 hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {renderRow(item, (patch) =>
            onChange(replaceAt(items, i, { ...item, ...patch }))
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...items, blank()])}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 px-4 py-4 text-sm font-semibold text-muted transition-colors hover:border-orange/40 hover:text-orange"
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>
    </div>
  );
}

/** Upload a new photo, or point at one that is already in /public. */
function ImagePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);

    const data = new FormData();
    data.append("file", file);
    const result = await uploadImageAction(data);

    setBusy(false);
    if (result.ok && result.url) {
      onChange(result.url);
    } else {
      setError(result.error ?? "Не удалось загрузить файл.");
    }
  }

  return (
    <div className="flex gap-4">
      <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-graphite">
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-steel">
            нет фото
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <Field
          label="Путь к файлу"
          value={value}
          onChange={onChange}
          hint="Например /gallery/hall-lifts.jpg"
        />

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-muted transition-colors hover:border-orange/40 hover:text-orange disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          Загрузить фото
        </button>

        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* tabs                                                                */
/* ------------------------------------------------------------------ */

type TabId =
  | "site"
  | "notice"
  | "services"
  | "priceList"
  | "gallery"
  | "steps"
  | "safetyRules"
  | "testimonials"
  | "faq"
  | "addonServices";

const TABS: { id: TabId; label: string }[] = [
  { id: "site", label: "Контакты" },
  { id: "notice", label: "Плашка" },
  { id: "services", label: "Услуги" },
  { id: "priceList", label: "Прайс" },
  { id: "gallery", label: "Галерея" },
  { id: "steps", label: "Как это работает" },
  { id: "safetyRules", label: "Безопасность" },
  { id: "testimonials", label: "Отзывы" },
  { id: "faq", label: "FAQ" },
  { id: "addonServices", label: "Доп. услуги" },
];

const SITE_GROUPS: {
  title: string;
  fields: {
    key: keyof SiteInfo;
    label: string;
    hint?: string;
    type?: "text" | "number";
  }[];
}[] = [
  {
    title: "Основное",
    fields: [
      { key: "name", label: "Короткое название" },
      { key: "fullName", label: "Полное название" },
      { key: "city", label: "Город" },
      { key: "posts", label: "Количество постов", type: "number" },
    ],
  },
  {
    title: "Реквизиты",
    fields: [
      { key: "legalName", label: "Юридическое лицо", hint: "Показывается в подвале сайта" },
      { key: "inn", label: "ИНН" },
      { key: "ogrn", label: "ОГРН" },
    ],
  },
  {
    title: "Контакты",
    fields: [
      { key: "phone", label: "Телефон (как показывать)" },
      {
        key: "phoneHref",
        label: "Телефон для ссылки",
        hint: "Только цифры и плюс, например +79620550070",
      },
      { key: "email", label: "E-mail" },
      { key: "address", label: "Адрес" },
      { key: "hours", label: "Режим работы" },
      {
        key: "hoursSchema",
        label: "Режим работы для поисковиков",
        hint: "Формат schema.org, например Mo-Su 09:00-19:00",
      },
    ],
  },
  {
    title: "Ссылки",
    fields: [
      {
        key: "yclientsUrl",
        label: "Онлайн-запись YCLIENTS",
        hint: "Адрес филиала, например https://n2392236.yclients.com",
      },
      { key: "telegram", label: "Telegram" },
      { key: "max", label: "MAX" },
      { key: "mapsUrl", label: "Ссылка на карту" },
      { key: "mapsRouteUrl", label: "Ссылка на маршрут" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* editor                                                              */
/* ------------------------------------------------------------------ */

export default function AdminEditor({
  initial,
  storePath,
}: {
  initial: SiteContent;
  storePath: string;
}) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [saved, setSaved] = useState<string>(() => JSON.stringify(initial));
  const [tab, setTab] = useState<TabId>("site");
  const [message, setMessage] = useState<{
    kind: "ok" | "error";
    text: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();

  const dirty = JSON.stringify(content) !== saved;

  function patch<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setContent((current) => ({ ...current, [key]: value }));
  }

  function patchSite(key: keyof SiteInfo, value: string) {
    setContent((current) => ({
      ...current,
      site: {
        ...current.site,
        [key]: key === "posts" ? Number(value) || 0 : value,
      },
    }));
  }

  function patchNotice(patch: Partial<SiteNotice>) {
    setContent((current) => ({
      ...current,
      notice: { ...current.notice, ...patch },
    }));
  }

  function patchMessage(
    tone: "work" | "live",
    patch: { title?: string; text?: string }
  ) {
    setContent((current) => ({
      ...current,
      notice: {
        ...current.notice,
        [tone]: { ...current.notice[tone], ...patch },
      },
    }));
  }

  function save() {
    startTransition(async () => {
      const snapshot = JSON.stringify(content);
      const result = await saveContentAction(content);

      if (result.ok) {
        setSaved(snapshot);
        setMessage({ kind: "ok", text: "Сохранено. Сайт обновлён." });
      } else {
        setMessage({
          kind: "error",
          text: result.error ?? "Не удалось сохранить.",
        });
      }
    });
  }

  function resetToDefaults() {
    const confirmed = window.confirm(
      "Вернуть весь контент к исходному состоянию? Все изменения, сделанные через админку, будут потеряны."
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await resetContentAction();
      if (result.ok) {
        window.location.reload();
      } else {
        setMessage({
          kind: "error",
          text: result.error ?? "Не удалось сбросить.",
        });
      }
    });
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* toolbar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-graphite-deep/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3.5 sm:px-6">
          <div className="mr-auto min-w-0">
            <h1 className="font-display text-base font-semibold text-offwhite">
              Управление сайтом
            </h1>
            <p className="truncate text-xs text-steel">{storePath}</p>
          </div>

          {dirty && (
            <span className="rounded-full border border-orange/30 bg-orange/10 px-3 py-1 text-xs font-semibold text-orange">
              Есть несохранённые изменения
            </span>
          )}

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-muted transition-colors hover:border-white/25 hover:text-offwhite"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Сайт
          </a>

          <button
            type="button"
            onClick={save}
            disabled={pending || !dirty}
            className="flex items-center gap-2 rounded-lg bg-orange px-4 py-2.5 text-xs font-semibold text-graphite-deep transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Сохранить
          </button>

          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-muted transition-colors hover:border-white/25 hover:text-offwhite"
            >
              <LogOut className="h-3.5 w-3.5" />
              Выйти
            </button>
          </form>
        </div>

        {message && (
          <div
            className={`px-4 pb-3 sm:px-6 ${
              message.kind === "ok" ? "text-emerald-400" : "text-red-400"
            }`}
          >
            <p className="mx-auto flex max-w-6xl items-center gap-2 text-xs">
              {message.kind === "ok" && <Check className="h-3.5 w-3.5" />}
              {message.text}
            </p>
          </div>
        )}
      </header>

      {/* section tabs */}
      <nav className="border-b border-white/10 bg-graphite">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`shrink-0 border-b-2 px-3.5 py-3 text-sm font-semibold transition-colors ${
                tab === item.id
                  ? "border-orange text-orange"
                  : "border-transparent text-muted hover:text-offwhite"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {tab === "site" && (
          <div className="space-y-6">
            {SITE_GROUPS.map((group) => (
              <section
                key={group.title}
                className="rounded-2xl border border-white/10 bg-surface p-5 sm:p-6"
              >
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-offwhite">
                  {group.title}
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {group.fields.map((field) => (
                    <Field
                      key={field.key}
                      label={field.label}
                      hint={field.hint}
                      type={field.type}
                      value={content.site[field.key]}
                      onChange={(value) => patchSite(field.key, value)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {tab === "notice" && (
          <section className="rounded-2xl border border-white/10 bg-surface p-5 sm:p-6">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-offwhite">
              Плашка-объявление
            </h2>
            <p className="mt-1 text-xs text-steel">
              Окошко в правом нижнем углу сайта, как у онлайн-чата. Посетитель
              может его свернуть — тогда останется маленькая кнопка. Если
              поменять заголовок, окно снова раскроется у всех.
            </p>

            <button
              type="button"
              onClick={() => patchNotice({ enabled: !content.notice.enabled })}
              className={`mt-5 flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                content.notice.enabled
                  ? "border-orange/40 bg-orange/10"
                  : "border-white/10 bg-graphite"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  content.notice.enabled
                    ? "bg-orange text-graphite-deep"
                    : "bg-white/5 text-steel"
                }`}
              >
                <Power className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-offwhite">
                  {content.notice.enabled ? "Плашка показывается" : "Плашка скрыта"}
                </span>
                <span className="block text-xs text-steel">
                  Нажмите, чтобы {content.notice.enabled ? "убрать её с сайта" : "показать её на сайте"}
                </span>
              </span>
              <span
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  content.notice.enabled ? "bg-orange" : "bg-white/15"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-offwhite transition-all ${
                    content.notice.enabled ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </span>
            </button>

            <div className="mt-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Цвет
              </span>
              <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
                {(
                  [
                    { tone: "work", label: "Оранжевая", hint: "идут работы, заявки закрыты", dot: "bg-orange" },
                    { tone: "live", label: "Зелёная", hint: "всё работает, запись открыта", dot: "bg-green" },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.tone}
                    type="button"
                    onClick={() => patchNotice({ tone: option.tone })}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                      content.notice.tone === option.tone
                        ? "border-white/30 bg-graphite"
                        : "border-white/10 bg-graphite/50 hover:border-white/20"
                    }`}
                  >
                    <span className={`h-3 w-3 shrink-0 rounded-full ${option.dot}`} />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-offwhite">
                        {option.label}
                      </span>
                      <span className="block text-xs text-steel">{option.hint}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {(
                [
                  { tone: "work", label: "Оранжевая — идут работы", dot: "bg-orange" },
                  { tone: "live", label: "Зелёная — всё работает", dot: "bg-green" },
                ] as const
              ).map((block) => (
                <div
                  key={block.tone}
                  className={`rounded-xl border p-4 transition-colors ${
                    content.notice.tone === block.tone
                      ? "border-white/25 bg-graphite"
                      : "border-white/10 bg-graphite/40"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2.5">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${block.dot}`} />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                      {block.label}
                    </span>
                    {content.notice.tone === block.tone && (
                      <span className="ml-auto shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-offwhite">
                        показывается сейчас
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Field
                      label="Заголовок"
                      value={content.notice[block.tone].title}
                      onChange={(title) => patchMessage(block.tone, { title })}
                    />
                    <Area
                      label="Текст"
                      rows={4}
                      value={content.notice[block.tone].text}
                      onChange={(text) => patchMessage(block.tone, { text })}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-steel">
              У зелёной плашки внизу появляется кнопка перехода к онлайн-записи.
              У оранжевой кнопки нет — только текст.
            </p>
          </section>
        )}

        {tab === "services" && (
          <ListEditor<Service>
            items={content.services}
            onChange={(next) => patch("services", next)}
            blank={() => ({ id: "post", title: "", description: "", bullets: [] })}
            addLabel="Добавить услугу"
            rowTitle={(item) => item.title}
            renderRow={(item, update) => (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Название"
                    value={item.title}
                    onChange={(title) => update({ title })}
                  />
                  <Field
                    label="Иконка"
                    value={item.id}
                    onChange={(id) => update({ id })}
                    hint="post, lift2, liftX или tire"
                  />
                </div>
                <Area
                  label="Описание"
                  value={item.description}
                  onChange={(description) => update({ description })}
                />
                <StringList
                  label="Что входит"
                  items={item.bullets}
                  onChange={(bullets) => update({ bullets })}
                />
              </div>
            )}
          />
        )}

        {tab === "priceList" && (
          <ListEditor<PriceRow>
            items={content.priceList}
            onChange={(next) => patch("priceList", next)}
            blank={() => ({ service: "", hour: 0, day: 0 })}
            addLabel="Добавить строку прайса"
            rowTitle={(item) => item.service}
            renderRow={(item, update) => (
              <div className="grid gap-4 sm:grid-cols-3">
                <Field
                  label="Услуга"
                  value={item.service}
                  onChange={(service) => update({ service })}
                />
                <Field
                  label="Цена за час, руб."
                  type="number"
                  value={item.hour}
                  onChange={(value) => update({ hour: Number(value) || 0 })}
                />
                <Field
                  label="Цена за сутки, руб."
                  type="number"
                  value={item.day}
                  onChange={(value) => update({ day: Number(value) || 0 })}
                />
              </div>
            )}
          />
        )}

        {tab === "gallery" && (
          <ListEditor<GalleryItem>
            items={content.gallery}
            onChange={(next) => patch("gallery", next)}
            blank={() => ({ src: "", alt: "", title: "", caption: "" })}
            addLabel="Добавить фото"
            rowTitle={(item) => item.title}
            renderRow={(item, update) => (
              <div className="space-y-4">
                <ImagePicker value={item.src} onChange={(src) => update({ src })} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Заголовок"
                    value={item.title}
                    onChange={(title) => update({ title })}
                  />
                  <Field
                    label="Описание для поисковиков"
                    value={item.alt}
                    onChange={(alt) => update({ alt })}
                  />
                </div>
                <Area
                  label="Подпись"
                  value={item.caption}
                  onChange={(caption) => update({ caption })}
                  rows={2}
                />
              </div>
            )}
          />
        )}

        {(tab === "steps" || tab === "safetyRules") && (
          <ListEditor<TitleText>
            items={content[tab]}
            onChange={(next) => patch(tab, next)}
            blank={() => ({ title: "", text: "" })}
            addLabel={tab === "steps" ? "Добавить шаг" : "Добавить правило"}
            rowTitle={(item) => item.title}
            renderRow={(item, update) => (
              <div className="space-y-4">
                <Field
                  label="Заголовок"
                  value={item.title}
                  onChange={(title) => update({ title })}
                />
                <Area
                  label="Текст"
                  value={item.text}
                  onChange={(text) => update({ text })}
                />
              </div>
            )}
          />
        )}

        {tab === "testimonials" && (
          <ListEditor<Testimonial>
            items={content.testimonials}
            onChange={(next) => patch("testimonials", next)}
            blank={() => ({ name: "", car: "", text: "" })}
            addLabel="Добавить отзыв"
            rowTitle={(item) => item.name}
            renderRow={(item, update) => (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Имя"
                    value={item.name}
                    onChange={(name) => update({ name })}
                  />
                  <Field
                    label="Автомобиль"
                    value={item.car}
                    onChange={(car) => update({ car })}
                  />
                </div>
                <Area
                  label="Текст отзыва"
                  value={item.text}
                  onChange={(text) => update({ text })}
                />
              </div>
            )}
          />
        )}

        {tab === "faq" && (
          <ListEditor<FaqItem>
            items={content.faq}
            onChange={(next) => patch("faq", next)}
            blank={() => ({ q: "", a: "" })}
            addLabel="Добавить вопрос"
            rowTitle={(item) => item.q}
            renderRow={(item, update) => (
              <div className="space-y-4">
                <Field
                  label="Вопрос"
                  value={item.q}
                  onChange={(q) => update({ q })}
                />
                <Area
                  label="Ответ"
                  value={item.a}
                  onChange={(a) => update({ a })}
                />
              </div>
            )}
          />
        )}

        {tab === "addonServices" && (
          <section className="rounded-2xl border border-white/10 bg-surface p-5 sm:p-6">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-offwhite">
              Дополнительные услуги
            </h2>
            <p className="mb-4 mt-1 text-xs text-steel">
              Показываются плитками под блоком услуг.
            </p>
            <StringList
              label="Список"
              items={content.addonServices}
              onChange={(next) => patch("addonServices", next)}
              placeholder="Добавить услугу"
            />
          </section>
        )}

        <div className="mt-10 border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={resetToDefaults}
            disabled={pending}
            className="flex items-center gap-2 text-xs font-semibold text-steel transition-colors hover:text-red-400 disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Сбросить весь контент к исходному
          </button>
        </div>
      </main>
    </div>
  );
}
