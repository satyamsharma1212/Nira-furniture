"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { createClient } from "@/lib/supabase/client";

export default function NavbarSwitcher() {
  const pathname = usePathname();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  /*
   * =========================================================
   * CHECK WHETHER CURRENT USER IS AN ADMIN
   * =========================================================
   */

  useEffect(() => {
    const supabase = createClient();

    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data: admin } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      setIsAdmin(!!admin);
      setLoading(false);
    };

    checkAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /*
   * =========================================================
   * ADMIN ROUTE CHECK
   * =========================================================
   *
   * Only /admin and /admin/* should ever display
   * the AdminNavbar.
   */

  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return null;
  }

  /*
   * =========================================================
   * ADMIN AREA
   * =========================================================
   *
   * If the user is visiting an admin route:
   *
   * /admin
   * /admin/products
   * /admin/categories
   * /admin/orders
   *
   * then show AdminNavbar only if the user is actually
   * registered in admin_users.
   */

  if (isAdminRoute) {
    if (!isAdmin) {
      return <Navbar />;
    }

    return <AdminNavbar />;
  }

  /*
   * =========================================================
   * PUBLIC WEBSITE
   * =========================================================
   *
   * Even if an admin is logged in, public routes always
   * use the normal NIRA Navbar.
   */

  return <Navbar />;
}