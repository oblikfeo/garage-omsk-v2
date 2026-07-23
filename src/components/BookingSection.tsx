"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { priceFor, services, site, type ServiceId } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import FadeIn from "./FadeIn";

type DurationType = "hour" | "day";

const timeSlots = Array.from({ length: 15 }, (_, i) => {
  const hour = 8 + i;
  return `${String(hour).padStart(2, "0")}:00`;
});

const stepLabels = ["Оборудование", "Время", "Контакты"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -24 : 24 }),
};

export default function BookingSection() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [serviceId, setServiceId] = useState<ServiceId | null>(null);
  const [durationType, setDurationType] = useState<DurationType>("hour");
  const [durationCount, setDurationCount] = useState(2);
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("10:00");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedService = services.find((s) => s.id === serviceId) ?? null;

  const total = useMemo(() => {
    if (!serviceId) return 0;
    const price = priceFor(serviceId);
    return durationType === "hour"
      ? price.hour * durationCount
      : price.day * durationCount;
  }, [serviceId, durationType, durationCount]);

  const canGoStep2 = !!serviceId;
  const canGoStep3 = !!date && !!time && durationCount > 0;
  const canSubmit = name.trim().length > 1 && phone.trim().length >= 10 && consent;

  function goTo(n: number) {
    setDirection(n > step ? 1 : -1);
    setStep(n);
  }

  function handleSubmit() {
    if (!canSubmit) return;
    setSubmitted(true);
  }

  function reset() {
    setStep(1);
    setDirection(-1);
    setServiceId(null);
    setDurationType("hour");
    setDurationCount(2);
    setDate(todayISO());
    setTime("10:00");
    setName("");
    setPhone("");
    setComment("");
    setConsent(false);
    setSubmitted(false);
  }

  return (
    <section id="booking" className="relative overflow-hidden py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-diagonal-grid opacity-60" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Онлайн-запись"
          title="Забронируйте пост за 2 минуты"
          description="Выберите оборудование, дату и время — администратор подтвердит бронь по телефону или в мессенджере."
          center
        />

        <FadeIn delay={0.1} className="mt-8 rounded-3xl border border-white/10 bg-surface p-5 sm:mt-10 sm:p-8">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 16 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-orange/15 text-orange"
              >
                <CheckCircle2 className="h-8 w-8" />
              </motion.div>
              <h3 className="mt-5 font-display text-2xl font-semibold text-offwhite">
                Заявка отправлена
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                Мы свяжемся с вами по телефону {phone} в течение 15 минут,
                чтобы подтвердить бронь на {date}, {time}. В боевой версии
                сайта заявка автоматически создаётся в системе онлайн-записи
                YCLIENTS.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-6 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-offwhite transition-colors duration-200 hover:bg-white/5"
              >
                Оформить ещё одну заявку
              </button>
            </motion.div>
          ) : (
            <>
              <ol className="mb-8 flex items-center justify-between gap-2">
                {stepLabels.map((label, i) => {
                  const n = i + 1;
                  const active = step === n;
                  const done = step > n;
                  return (
                    <li key={label} className="flex flex-1 items-center gap-2">
                      <motion.div
                        animate={{ scale: active ? 1.08 : 1 }}
                        transition={{ duration: 0.3 }}
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-300 ${
                          done
                            ? "bg-orange text-graphite-deep"
                            : active
                              ? "border-2 border-orange text-orange"
                              : "border border-white/15 text-muted"
                        }`}
                      >
                        {done ? <CheckCircle2 className="h-4 w-4" /> : n}
                      </motion.div>
                      <span
                        className={`hidden text-xs font-medium transition-colors duration-300 sm:block ${
                          active || done ? "text-offwhite" : "text-muted"
                        }`}
                      >
                        {label}
                      </span>
                      {n < 3 && (
                        <span className="relative mx-1 h-px flex-1 overflow-hidden bg-white/10">
                          <motion.span
                            className="absolute inset-0 origin-left bg-orange"
                            initial={false}
                            animate={{ scaleX: step > n ? 1 : 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>

              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <h3 className="font-display text-lg font-semibold text-offwhite">
                        Что арендуем?
                      </h3>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {services.map((s) => {
                          const price = priceFor(s.id);
                          const active = serviceId === s.id;
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => setServiceId(s.id)}
                              className={`rounded-xl border p-4 text-left transition-all duration-200 active:scale-[0.98] ${
                                active
                                  ? "border-orange bg-orange/10 shadow-glow"
                                  : "border-white/10 bg-graphite hover:-translate-y-0.5 hover:border-white/25"
                              }`}
                            >
                              <span className="font-display text-sm font-semibold text-offwhite">
                                {s.title}
                              </span>
                              <span className="mt-1 block text-xs text-muted">
                                от {price.hour.toLocaleString("ru-RU")} ₽ / час
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-8 flex justify-end">
                        <button
                          type="button"
                          disabled={!canGoStep2}
                          onClick={() => goTo(2)}
                          className="flex items-center gap-2 rounded-xl bg-orange px-6 py-3 text-sm font-semibold text-graphite-deep transition-all duration-200 hover:enabled:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Далее
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <h3 className="font-display text-lg font-semibold text-offwhite">
                        Когда и на сколько?
                      </h3>

                      <div className="mt-4 inline-flex rounded-xl border border-white/10 bg-graphite p-1">
                        {(["hour", "day"] as DurationType[]).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => {
                              setDurationType(t);
                              setDurationCount(t === "hour" ? 2 : 1);
                            }}
                            className={`relative rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                              durationType === t ? "text-graphite-deep" : "text-muted"
                            }`}
                          >
                            {durationType === t && (
                              <motion.span
                                layoutId="duration-pill"
                                className="absolute inset-0 rounded-lg bg-orange"
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              />
                            )}
                            <span className="relative">
                              {t === "hour" ? "Почасово" : "Посуточно"}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                            {durationType === "hour" ? "Количество часов" : "Количество суток"}
                          </label>
                          <div className="mt-2 flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setDurationCount((v) => Math.max(1, v - 1))}
                              className="h-10 w-10 rounded-lg border border-white/15 text-lg text-offwhite transition-colors duration-200 hover:bg-white/5 active:scale-95"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-display text-lg font-semibold text-offwhite">
                              {durationCount}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setDurationCount((v) =>
                                  Math.min(durationType === "hour" ? 12 : 14, v + 1)
                                )
                              }
                              className="h-10 w-10 rounded-lg border border-white/15 text-lg text-offwhite transition-colors duration-200 hover:bg-white/5 active:scale-95"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="date" className="text-xs font-semibold uppercase tracking-wide text-muted">
                            Дата
                          </label>
                          <input
                            id="date"
                            type="date"
                            min={todayISO()}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="mt-2 w-full rounded-lg border border-white/15 bg-graphite px-3 py-2.5 text-sm text-offwhite outline-none transition-colors duration-200 focus:border-orange"
                          />
                        </div>
                      </div>

                      <div className="mt-5">
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                          Время начала
                        </label>
                        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTime(slot)}
                              className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-all duration-200 active:scale-95 ${
                                time === slot
                                  ? "border-orange bg-orange/10 text-orange"
                                  : "border-white/10 text-muted hover:border-white/25"
                              }`}
                            >
                              <Clock className="h-3.5 w-3.5 shrink-0" />
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>

                      {selectedService && (
                        <motion.div
                          key={total}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                          className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-graphite px-4 py-3 text-sm"
                        >
                          <span className="text-muted">Итого за бронь</span>
                          <span className="font-display text-lg font-semibold text-orange">
                            {total.toLocaleString("ru-RU")} ₽
                          </span>
                        </motion.div>
                      )}

                      <div className="mt-8 flex justify-between">
                        <button
                          type="button"
                          onClick={() => goTo(1)}
                          className="flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-offwhite transition-colors duration-200 hover:bg-white/5"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Назад
                        </button>
                        <button
                          type="button"
                          disabled={!canGoStep3}
                          onClick={() => goTo(3)}
                          className="flex items-center gap-2 rounded-xl bg-orange px-6 py-3 text-sm font-semibold text-graphite-deep transition-all duration-200 hover:enabled:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Далее
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <h3 className="font-display text-lg font-semibold text-offwhite">
                        Ваши контакты
                      </h3>

                      <div className="mt-4 grid gap-5 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-muted">
                            Имя
                          </label>
                          <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Как к вам обращаться"
                            className="mt-2 w-full rounded-lg border border-white/15 bg-graphite px-3 py-2.5 text-sm text-offwhite outline-none placeholder:text-muted/60 transition-colors duration-200 focus:border-orange"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wide text-muted">
                            Телефон
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+7 (___) ___-__-__"
                            className="mt-2 w-full rounded-lg border border-white/15 bg-graphite px-3 py-2.5 text-sm text-offwhite outline-none placeholder:text-muted/60 transition-colors duration-200 focus:border-orange"
                          />
                        </div>
                      </div>

                      <div className="mt-5">
                        <label htmlFor="comment" className="text-xs font-semibold uppercase tracking-wide text-muted">
                          Комментарий (необязательно)
                        </label>
                        <textarea
                          id="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={3}
                          placeholder="Например: нужен подъёмник для замены сайлентблоков"
                          className="mt-2 w-full resize-none rounded-lg border border-white/15 bg-graphite px-3 py-2.5 text-sm text-offwhite outline-none placeholder:text-muted/60 transition-colors duration-200 focus:border-orange"
                        />
                      </div>

                      <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/30 bg-graphite text-orange accent-orange"
                        />
                        <span>
                          Я согласен на{" "}
                          <Link href="/politika-konfidentsialnosti" className="text-blue underline underline-offset-2">
                            обработку персональных данных
                          </Link>{" "}
                          в соответствии с политикой конфиденциальности {site.fullName}.
                        </span>
                      </label>

                      <div className="mt-8 flex justify-between">
                        <button
                          type="button"
                          onClick={() => goTo(2)}
                          className="flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-offwhite transition-colors duration-200 hover:bg-white/5"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Назад
                        </button>
                        <button
                          type="button"
                          disabled={!canSubmit}
                          onClick={handleSubmit}
                          className="flex items-center gap-2 rounded-xl bg-orange px-6 py-3 text-sm font-semibold text-graphite-deep shadow-glow transition-all duration-200 hover:enabled:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <CalendarCheck className="h-4 w-4" />
                          Отправить заявку
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
