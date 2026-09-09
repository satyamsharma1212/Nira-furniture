import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "NIRA Customer";

  const email = user.email || "";

  const avatar =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    "";

  const firstName = name.split(" ")[0];

  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#171512]">

      {/* HEADER */}
    

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-10 lg:px-12 lg:py-20">

        {/* INTRO */}
        <div className="mb-12">
          <p className="mb-4 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#765A32]">
            My Account
          </p>

          <h1 className="font-serif text-5xl font-medium leading-none tracking-[-0.03em] sm:text-6xl lg:text-7xl">
            Welcome back,
            <br />
            <span className="italic text-[#765A32]">
              {firstName}.
            </span>
          </h1>
        </div>

        {/* GRID */}
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">

          {/* PROFILE SUMMARY */}
          <div className="border border-[#171512]/10 bg-white/40 p-7 sm:p-8">

            <div className="mb-8 flex items-center gap-5">

              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#B88A2B]/30 bg-[#EDE7DC]">

                {avatar ? (
                  <Image
                    src={avatar}
                    alt={name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <span className="font-serif text-3xl text-[#765A32]">
                    {firstName.charAt(0)}
                  </span>
                )}

              </div>

              <div>
                <p className="font-serif text-2xl font-medium">
                  {name}
                </p>

                <p className="mt-1 break-all font-sans text-xs text-[#171512]/45">
                  {email}
                </p>
              </div>

            </div>

            <div className="border-t border-[#171512]/10 pt-6">

              <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#765A32]">
                Authentication
              </p>

              <p className="mt-2 font-sans text-sm text-[#171512]/55">
                Signed in securely with Google
              </p>

            </div>

          </div>

          {/* ACCOUNT MENU */}
          <div className="border border-[#171512]/10 bg-white/40">

            <Link
              href="/account/profile"
              className="group flex min-h-[105px] items-center justify-between border-b border-[#171512]/10 px-7 transition-colors hover:bg-[#EEE8DE]/60 sm:px-9"
            >
              <div>
                <p className="font-serif text-2xl font-medium">
                  Personal Details
                </p>

                <p className="mt-2 font-sans text-xs text-[#171512]/45">
                  View and manage your profile
                </p>
              </div>

              <span className="text-xl text-[#765A32]/50 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              href="/account/orders"
              className="group flex min-h-[105px] items-center justify-between border-b border-[#171512]/10 px-7 transition-colors hover:bg-[#EEE8DE]/60 sm:px-9"
            >
              <div>
                <p className="font-serif text-2xl font-medium">
                  My Orders
                </p>

                <p className="mt-2 font-sans text-xs text-[#171512]/45">
                  View your NIRA purchases
                </p>
              </div>

              <span className="text-xl text-[#765A32]/50 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              href="/contact"
              className="group flex min-h-[105px] items-center justify-between border-b border-[#171512]/10 px-7 transition-colors hover:bg-[#EEE8DE]/60 sm:px-9"
            >
              <div>
                <p className="font-serif text-2xl font-medium">
                  Need Help?
                </p>

                <p className="mt-2 font-sans text-xs text-[#171512]/45">
                  Contact the NIRA team
                </p>
              </div>

              <span className="text-xl text-[#765A32]/50 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>

            {/* LOGOUT */}
            <div className="p-6 sm:p-8">
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full border border-[#171512]/15 px-6 py-4 font-sans text-[10px] font-semibold uppercase tracking-[0.22em] transition-all duration-300 hover:border-[#171512] hover:bg-[#171512] hover:text-white"
                >
                  Sign Out
                </button>
              </form>
            </div>

          </div>

        </div>

      </section>
    </main>
  );
}