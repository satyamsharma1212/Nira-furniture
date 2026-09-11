"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleLogin() {
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#171512]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* BRANDING */}
        <section className="hidden min-h-screen flex-col justify-between bg-[#171512] p-12 text-[#F7F4EE] lg:flex">
          <div>
            <Link
              href="/"
              className="font-serif text-4xl font-semibold tracking-[0.18em]"
            >
              NIRA
            </Link>

            <p className="mt-3 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#B88A2B]">
              Furniture
            </p>
          </div>

          <div className="max-w-xl">
            <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-[#B88A2B]">
              Administration
            </p>

            <h1 className="font-serif text-6xl font-semibold leading-[0.9] xl:text-8xl">
              Manage the
              <br />
              collection.
            </h1>

            <p className="mt-8 max-w-lg font-sans text-base font-medium leading-7 text-white/55">
              Manage NIRA products, categories, orders and customer
              information from one secure workspace.
            </p>
          </div>

          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
            NIRA Furniture Administration
          </p>
        </section>

        {/* LOGIN */}
        <section className="flex min-h-screen items-center justify-center px-6 py-16 sm:px-10">
          <div className="w-full max-w-md">

            <div className="mb-12 lg:hidden">
              <Link
                href="/"
                className="font-serif text-4xl font-semibold tracking-[0.18em]"
              >
                NIRA
              </Link>
            </div>

            <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-[#765A32]">
              Admin Portal
            </p>

            <h1 className="font-serif text-5xl font-semibold leading-none tracking-[-0.03em] sm:text-6xl">
              Welcome back.
            </h1>

            <p className="mt-6 font-sans text-base font-medium leading-7 text-[#171512]/55">
              Sign in with your authorized Google account to access the NIRA
              administration panel.
            </p>

            <div className="mt-10 border border-[#171512]/10 bg-white/40 p-6 sm:p-8">

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-3 border border-[#171512]/15 bg-[#FBF9F3] px-5 font-sans text-sm font-semibold transition-all hover:border-[#765A32] hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {/* Google icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M21.35 12.27c0-.71-.06-1.39-.18-2.05H12v3.88h5.22a4.46 4.46 0 0 1-1.94 2.93v2.44h3.14c1.84-1.7 2.93-4.21 2.93-7.2Z"
                  />

                  <path
                    fill="#34A853"
                    d="M12 21.75c2.63 0 4.84-.87 6.45-2.35l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.75 9.75 0 0 0 12 21.75Z"
                  />

                  <path
                    fill="#FBBC05"
                    d="M6.54 13.85a5.86 5.86 0 0 1 0-3.7V7.63H3.3a9.75 9.75 0 0 0 0 8.74l3.24-2.52Z"
                  />

                  <path
                    fill="#EA4335"
                    d="M12 6.12c1.43 0 2.72.49 3.73 1.46l2.8-2.8C16.83 3.18 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.7 5.38l3.24 2.52C7.31 7.84 9.46 6.12 12 6.12Z"
                  />
                </svg>

                {loading
                  ? "Signing in..."
                  : "Continue with Google"}
              </button>

              {error && (
                <div className="mt-5 border border-red-900/15 bg-red-50 px-4 py-3">
                  <p className="font-sans text-sm font-semibold text-red-700">
                    {error}
                  </p>
                </div>
              )}

              <div className="mt-6 border-t border-[#171512]/10 pt-6">
                <p className="font-sans text-xs font-medium leading-5 text-[#171512]/45">
                  Only authorized NIRA administrators can access the admin
                  dashboard.
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="mt-8 inline-flex font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#171512]/45 transition-colors hover:text-[#765A32]"
            >
              ← Back to Store
            </Link>

          </div>
        </section>
      </div>
    </main>
  );
}