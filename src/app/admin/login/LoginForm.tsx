"use client";

import { useActionState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { loginAction, type LoginState } from "../actions";

export default function LoginForm({ configured }: { configured: boolean }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {}
  );

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface p-7 shadow-xl shadow-black/40"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange/10 text-orange">
          <KeyRound className="h-6 w-6" />
        </div>

        <h1 className="mt-5 font-display text-xl font-semibold text-offwhite">
          Панель управления сайтом
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Введите пароль администратора.
        </p>

        <label
          htmlFor="password"
          className="mt-6 block text-xs font-semibold uppercase tracking-wider text-muted"
        >
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          disabled={!configured}
          className="mt-2 w-full rounded-xl border border-white/10 bg-graphite px-4 py-3 text-sm text-offwhite outline-none transition-colors focus:border-orange/60"
        />

        {!configured && (
          <p className="mt-4 rounded-lg border border-orange/30 bg-orange/10 px-3 py-2.5 text-xs leading-relaxed text-orange">
            На сервере не задана переменная ADMIN_PASSWORD. Добавьте её в
            окружение и перезапустите сервис.
          </p>
        )}

        {state.error && (
          <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-300">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending || !configured}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange px-5 py-3.5 text-sm font-semibold text-graphite-deep transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          Войти
        </button>
      </form>
    </div>
  );
}
