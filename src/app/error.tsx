"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Home,
  RefreshCcw,
} from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(
      "NIRA application error:",
      error,
    );
  }, [error]);

  return (
    <main className="min-h-screen bg-[#F7F4EE] px-6 text-[#171512]">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center py-20">
        <div className="w-full border border-[#171512]/10 bg-white px-6 py-14 text-center sm:px-10 sm:py-20">

          {/* ICON */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#765A32]/20 bg-[#F7F4EE]">
            <AlertTriangle
              size={28}
              strokeWidth={1.4}
              className="text-[#765A32]"
            />
          </div>

          {/* LABEL */}
          <p className="mt-8 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#765A32]">
            NIRA Furniture
          </p>

          {/* TITLE */}
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Something went wrong
          </h1>

          {/* DESCRIPTION */}
          <p className="mx-auto mt-5 max-w-xl text-sm font-medium leading-7 text-[#171512]/50">
            We couldn't complete this request right now.
            Please try again. Your account and saved
            information are safe.
          </p>

          {/* ACTIONS */}
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

            <button
              type="button"
              onClick={() => reset()}
              className="
                inline-flex
                min-h-12
                items-center
                justify-center
                gap-3
                bg-[#171512]
                px-7
                font-sans
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-white
                transition
                hover:bg-[#765A32]
              "
            >
              <RefreshCcw size={14} />
              Try Again
            </button>

            <Link
              href="/"
              className="
                inline-flex
                min-h-12
                items-center
                justify-center
                gap-3
                border
                border-[#171512]/15
                bg-white
                px-7
                font-sans
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#171512]
                transition
                hover:border-[#765A32]
                hover:text-[#765A32]
              "
            >
              <Home size={14} />
              Home
            </Link>

          </div>

          {/* BACK */}
          <div className="mt-8">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="
                inline-flex
                items-center
                gap-2
                font-sans
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#171512]/40
                transition
                hover:text-[#765A32]
              "
            >
              <ArrowLeft size={13} />
              Go Back
            </button>
          </div>

          {/* DIGEST */}
          {error?.digest && (
            <p className="mt-8 text-[9px] font-medium tracking-[0.12em] text-[#171512]/25">
              Error reference: {error.digest}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}