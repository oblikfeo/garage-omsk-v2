"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Minus, Plus, RotateCcw, X } from "lucide-react";

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.35;

type Point = { x: number; y: number };

export default function PlanViewer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const resetView = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const close = useCallback(() => {
    resetView();
    onClose();
  }, [onClose, resetView]);

  const zoomBy = useCallback((delta: number) => {
    setZoom((current) => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current + delta));
      if (next <= MIN_ZOOM) {
        setOffset({ x: 0, y: 0 });
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "+" || e.key === "=") zoomBy(ZOOM_STEP);
      if (e.key === "-") zoomBy(-ZOOM_STEP);
      if (e.key === "0") resetView();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close, zoomBy, resetView]);

  useEffect(() => {
    if (!open || !stageRef.current) return;
    const el = stageRef.current;
    const onWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      zoomBy(e.deltaY < 0 ? ZOOM_STEP * 0.6 : -ZOOM_STEP * 0.6);
    };
    el.addEventListener("wheel", onWheelNative, { passive: false });
    return () => el.removeEventListener("wheel", onWheelNative);
  }, [open, zoomBy]);

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (zoom <= MIN_ZOOM) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
    };
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current?.active) return;
    setOffset({
      x: drag.current.originX + (e.clientX - drag.current.startX),
      y: drag.current.originY + (e.clientY - drag.current.startY),
    });
  }

  function onPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    drag.current.active = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col bg-graphite-deep/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          role="dialog"
          aria-modal="true"
          aria-label="Схема расстановки постов"
        >
          <header className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <p className="truncate font-display text-base font-semibold text-offwhite sm:text-lg">
                Схема бокса
              </p>
              <p className="truncate text-xs text-muted sm:text-sm">
                Расстановка 8 постов · масштаб колёсиком или кнопками
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden items-center gap-1 rounded-xl border border-white/10 bg-graphite/80 p-1 sm:flex">
                <button
                  type="button"
                  onClick={() => zoomBy(-ZOOM_STEP)}
                  aria-label="Уменьшить"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-offwhite transition-colors hover:bg-white/10"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-display text-xs font-semibold text-muted">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => zoomBy(ZOOM_STEP)}
                  aria-label="Увеличить"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-offwhite transition-colors hover:bg-white/10"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={resetView}
                  aria-label="Сбросить масштаб"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-offwhite transition-colors hover:bg-white/10"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              <a
                href="/plan/schema.pdf"
                download="schema-boksa.pdf"
                className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-white/15 bg-graphite px-3 py-2.5 text-xs font-semibold text-offwhite transition-colors hover:border-orange/40 hover:text-orange sm:px-4 sm:text-sm"
              >
                <Download className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Скачать PDF</span>
              </a>

              <button
                type="button"
                onClick={close}
                aria-label="Закрыть"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-offwhite transition-colors hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div
            ref={stageRef}
            className={`relative min-h-0 flex-1 overflow-hidden bg-[#0e1012] ${
              zoom > MIN_ZOOM ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
            }`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onDoubleClick={() =>
              zoom >= 2 ? resetView() : zoomBy(ZOOM_STEP * 2)
            }
          >
            <div className="pointer-events-none absolute inset-0 bg-blueprint opacity-20" />

            <motion.div
              className="absolute inset-0 flex items-center justify-center p-3 sm:p-6"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                transformOrigin: "center center",
              }}
            >
              {/*
                Plain <img>, not next/image: the optimizer serves a downscaled
                file, and CSS zoom then magnifies blur. CAD needs the full PNG.
              */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/plan/schema.png"
                alt="Схема расстановки постов, подъёмников и оборудования в боксе"
                width={4200}
                height={2971}
                draggable={false}
                className="pointer-events-none max-h-[min(78vh,820px)] w-auto max-w-[min(96vw,1400px)] select-none rounded-xl bg-white object-contain shadow-2xl shadow-black/50 ring-1 ring-white/20"
              />
            </motion.div>
          </div>

          <div className="relative z-10 flex shrink-0 items-center justify-center gap-2 border-t border-white/10 px-4 py-2.5 sm:hidden">
            <button
              type="button"
              onClick={() => zoomBy(-ZOOM_STEP)}
              aria-label="Уменьшить"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-offwhite"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-14 text-center font-display text-sm font-semibold text-muted">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => zoomBy(ZOOM_STEP)}
              aria-label="Увеличить"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-offwhite"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={resetView}
              aria-label="Сбросить масштаб"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-offwhite"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
