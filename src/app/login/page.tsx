import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/presentation/components/login-form";

export const metadata: Metadata = { title: "Iniciar sesión · CityPulse" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <section className="flex w-full max-w-sm flex-col gap-6 rounded-xl bg-white p-8 shadow-sm dark:bg-zinc-950">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Entra con tu cuenta de CityPulse.
          </p>
        </header>
        {/* LoginForm lee ?from= con useSearchParams: dato de la petición → Suspense */}
        <Suspense>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
