"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Tags,
  }, {
    name: "Orders",
    href: "/admin/orders",
    icon: Tags,
  },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);

    await supabase.auth.signOut();

    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#E7E0D4] bg-[#F7F4EE]/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-10">
          
          {/* Logo */}
          <Link
            href="/admin"
            className="flex items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171512] text-sm font-semibold tracking-wider text-white">
              N
            </div>

            <div className="leading-none">
              <div className="font-serif text-2xl tracking-[0.18em] text-[#171512]">
                NIRA
              </div>

              <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.25em] text-[#765A32]">
                Admin Panel
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#171512] text-white"
                      : "text-[#4B463F] hover:bg-[#EDE7DC] hover:text-[#171512]"
                  }`}
                >
                  <Icon size={16} strokeWidth={1.8} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Logout */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="hidden items-center gap-2 rounded-full border border-[#D8D0C3] px-5 py-2.5 text-sm font-medium text-[#4B463F] transition hover:border-[#171512] hover:bg-[#171512] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 md:flex"
          >
            <LogOut size={16} strokeWidth={1.8} />
            {loggingOut ? "Signing out..." : "Sign out"}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Toggle admin menu"
            onClick={() => setMobileOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D8D0C3] text-[#171512] md:hidden"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="fixed inset-0 top-20 z-40 overflow-y-auto bg-[#F7F4EE] md:hidden">
          <div className="px-5 py-8 sm:px-8">
            
            <div className="mb-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#765A32]">
                Administration
              </p>

              <h2 className="mt-2 font-serif text-3xl text-[#171512]">
                NIRA Control Panel
              </h2>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;

                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between rounded-2xl px-5 py-4 transition ${
                      isActive
                        ? "bg-[#171512] text-white"
                        : "bg-[#EDE7DC] text-[#171512]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon size={19} strokeWidth={1.8} />
                      <span className="text-base font-medium">
                        {item.name}
                      </span>
                    </div>

                    <ChevronRight size={18} strokeWidth={1.7} />
                  </Link>
                );
              })}
            </nav>

            <div className="my-8 h-px bg-[#DDD5C8]" />

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-4 rounded-2xl border border-[#D8D0C3] px-5 py-4 text-left text-[#171512] transition hover:bg-[#171512] hover:text-white disabled:opacity-50"
            >
              <LogOut size={19} strokeWidth={1.8} />

              <span className="text-base font-medium">
                {loggingOut ? "Signing out..." : "Sign out"}
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}