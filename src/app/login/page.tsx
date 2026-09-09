"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nextPath, setNextPath] = useState("/account");

  /*
   * Read the page the customer originally wanted
   * to visit.
   *
   * Example:
   *
   * /login?next=/checkout?product=nira-oslo-curved-sofa-jpeg
   */
  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search,
    );

    const next = params.get("next");

    if (next && next.startsWith("/")) {
      setNextPath(next);
    }

    const loginError =
      params.get("error");

    if (loginError) {
      setError(loginError);
    }
  }, []);

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      setError("");

      const supabase = createClient();

      /*
       * Preserve the exact page the customer
       * originally requested.
       *
       * Example:
       *
       * /checkout?product=abc
       *
       * becomes:
       *
       * /auth/callback?next=%2Fcheckout%3Fproduct%3Dabc
       */
      const callbackUrl =
        `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          nextPath,
        )}`;

      const {
        error: oauthError,
      } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: callbackUrl,
          },
        });

      if (oauthError) {
        console.error(
          "Google OAuth error:",
          oauthError,
        );

        setError(
          oauthError.message ||
            "Unable to start Google sign in.",
        );

        setLoading(false);
      }
    } catch (err) {
      console.error(
        "Google login failed:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in with Google.",
      );

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#171512]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =========================================================
            LEFT — NIRA BRANDING
        ========================================================= */}

        <section className="relative hidden overflow-hidden bg-[#171512] lg:flex">

          <div className="absolute inset-0 opacity-[0.08]">

            <div className="absolute -left-32 top-20 h-96 w-96 rounded-full border border-[#B88A2B]" />

            <div className="absolute -right-40 bottom-10 h-[500px] w-[500px] rounded-full border border-[#B88A2B]" />

            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#B88A2B]/50" />

          </div>

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* LOGO */}

            <Link
              href="/"
              className="
                font-serif
                text-3xl
                font-medium
                tracking-[0.18em]
                text-[#F7F4EE]
                transition-colors
                duration-300
                hover:text-[#B89A62]
              "
            >
              NIRA
            </Link>

            {/* CENTER */}

            <div className="max-w-xl">

              <p className="mb-5 font-sans text-[10px] font-medium uppercase tracking-[0.35em] text-[#B88A2B]">
                Welcome to NIRA
              </p>

              <h1 className="font-serif text-6xl font-medium leading-[0.95] tracking-[-0.03em] text-[#F7F4EE] xl:text-7xl">
                Spaces made
                <br />
                <span className="italic text-[#B89A62]">
                  timeless.
                </span>
              </h1>

              <p className="mt-7 max-w-md font-sans text-lg font-medium leading-8 text-[#F7F4EE]/70">
                Sign in to your NIRA account and continue
                exploring furniture designed for considered
                spaces.
              </p>

            </div>

            {/* FOOTER */}

            <div className="flex items-center justify-between border-t border-white/10 pt-6">

              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">
                NIRA Furniture
              </span>

              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">
                Made in India
              </span>

            </div>

          </div>

        </section>

        {/* =========================================================
            RIGHT — LOGIN
        ========================================================= */}

        <section className="flex min-h-screen items-start justify-center px-6 pb-12 pt-24 sm:px-10 sm:pb-12 sm:pt-28 lg:px-16 lg:pt-32">

          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}

            <div className="mb-16 lg:hidden">

              <Link
                href="/"
                className="
                  font-serif
                  text-3xl
                  font-medium
                  tracking-[0.18em]
                  text-[#171512]
                "
              >
                NIRA
              </Link>

            </div>

            {/* HEADER */}

            <div className="mb-10">

              <p className="mb-3 font-sans text-[14px] font-medium uppercase tracking-[0.3em] text-[#765A32]">
                Customer Account
              </p>

              <h2 className="font-serif text-5xl font-bold leading-none tracking-[-0.03em] sm:text-6xl">
                Sign in
              </h2>

              <p className="mt-5 font-sans text-lg font-semibold leading-8 text-[#171512]/60">
                Sign in with your Google account to access
                your NIRA account.
              </p>

            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-6 border border-red-900/15 bg-red-50 px-4 py-3">

                <p className="font-sans text-xs leading-5 text-red-700">
                  {error}
                </p>

              </div>
            )}

            {/* GOOGLE LOGIN */}

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="
                group
                flex
                h-14
                w-full
                items-center
                justify-center
                gap-3
                border
                border-[#171512]/15
                bg-white
                px-6
                font-sans
                text-[11px]
                font-medium
                uppercase
                tracking-[0.16em]
                text-[#171512]
                transition-all
                duration-300
                hover:border-[#B88A2B]
                hover:bg-[#FBF9F3]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              {/* GOOGLE ICON */}

              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.23c0-.79-.07-1.55-.2-2.28H12v4.31h5.24a4.48 4.48 0 0 1-1.95 2.94v2.44h3.16c1.85-1.7 2.9-4.21 2.9-7.41Z"
                />

                <path
                  fill="#34A853"
                  d="M12 21.75c2.64 0 4.85-.87 6.46-2.36l-3.16-2.44c-.87.58-1.98.92-3.3.92-2.54 0-4.69-1.72-5.46-4.03H3.28v2.52A9.75 9.75 0 0 0 12 21.75Z"
                />

                <path
                  fill="#FBBC05"
                  d="M6.54 13.84A5.86 5.86 0 0 1 6.23 12c0-.64.11-1.26.31-1.84V7.64H3.28A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.03 4.36l3.26-2.52Z"
                />

                <path
                  fill="#EA4335"
                  d="M12 6.13c1.44 0 2.73.5 3.74 1.48l2.8-2.8C16.85 3.27 14.64 2.25 12 2.25a9.75 9.75 0 0 0-8.72 5.39l3.26 2.52C7.31 7.85 9.46 6.13 12 6.13Z"
                />
              </svg>

              <span className="font-semibold">
                {loading
                  ? "Connecting..."
                  : "Continue with Google"}
              </span>

            </button>

            {/* DIVIDER */}

            <div className="my-9 flex items-center gap-4">

              <div className="h-px flex-1 bg-[#171512]/10" />

              <span className="whitespace-nowrap font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[#171512]/40">
                Secure sign in
              </span>

              <div className="h-px flex-1 bg-[#171512]/10" />

            </div>

            {/* SECURITY */}

            <div className="border border-[#171512]/10 bg-white/30 px-5 py-5">

              <div className="flex items-start gap-4">

                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-[#B88A2B]/20 bg-[#F7F4EE]">

                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-[#765A32]"
                  >
                    <rect
                      width="18"
                      height="11"
                      x="3"
                      y="11"
                      rx="2"
                    />

                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>

                </div>

                <p className="font-sans text-xl font-semibold leading-9 text-[#171512]/65">
                  Your Google account is securely
                  authenticated through Supabase. NIRA never
                  sees or stores your Google password.
                </p>

              </div>

            </div>

            {/* NEW CUSTOMER */}

            <div className="mt-10 border-t border-[#171512]/10 pt-7 text-center">

              <p className="font-sans text-lg font-semibold leading-8 text-[#171512]/60">
                New to NIRA?{" "}
                <span className="text-[#765A32]">
                  Simply continue with Google to create your
                  account.
                </span>
              </p>

            </div>

            {/* BACK HOME */}

            <div className="mt-8 text-center">

              <Link
                href="/"
                className="
                  font-sans
                  text-sm
                  font-extrabold
                  uppercase
                  tracking-[0.25em]
                  text-[#171512]/55
                  transition-colors
                  hover:text-[#765A32]
                "
              >
                ← Back to NIRA
              </Link>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}