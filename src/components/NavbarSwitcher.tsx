"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { createClient } from "@/lib/supabase/client";

export default function NavbarSwitcher() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return null;
  }

  return isAdmin ? <AdminNavbar /> : <Navbar />;
}