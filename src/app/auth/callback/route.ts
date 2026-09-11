import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");

  const origin = url.origin;

  /*
   * The `next` parameter is only used for
   * normal users.
   *
   * Admin users will ALWAYS be redirected
   * to /admin.
   */
  const next = url.searchParams.get("next");

  const safeNext =
    next &&
    next.startsWith("/") &&
    !next.startsWith("//")
      ? next
      : "/account";

  /*
   * =========================================================
   * CHECK OAUTH CODE
   * =========================================================
   */

  if (!code) {
    console.error(
      "OAuth callback: missing authorization code",
    );

    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(
        "Authentication failed. No authorization code was received.",
      )}`,
    );
  }

  /*
   * =========================================================
   * CREATE REDIRECT RESPONSE
   * =========================================================
   *
   * IMPORTANT:
   *
   * We create the redirect response BEFORE exchanging
   * the OAuth code so that Supabase session cookies
   * can be written onto this exact response.
   */

  const redirectResponse =
    NextResponse.redirect(
      `${origin}${safeNext}`,
    );

  /*
   * =========================================================
   * CREATE SUPABASE SERVER CLIENT
   * =========================================================
   */

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env
      .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({
              name,
              value,
              options,
            }) => {
              redirectResponse.cookies.set(
                name,
                value,
                options,
              );
            },
          );
        },
      },
    },
  );

  /*
   * =========================================================
   * EXCHANGE OAUTH CODE FOR SESSION
   * =========================================================
   */

  const {
    data,
    error,
  } =
    await supabase.auth.exchangeCodeForSession(
      code,
    );

  if (error) {
    console.error(
      "OAuth callback error:",
      error,
    );

    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(
        "Unable to complete authentication: " +
          error.message,
      )}`,
    );
  }

  /*
   * =========================================================
   * VERIFY SESSION
   * =========================================================
   */

  if (!data.session || !data.user) {
    console.error(
      "OAuth callback: session was not created.",
    );

    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(
        "Authentication session could not be created.",
      )}`,
    );
  }

  const user = data.user;

  console.log(
    "OAuth login successful:",
    user.email,
  );

  /*
   * =========================================================
   * CHECK ADMIN
   * =========================================================
   *
   * An admin is identified by the user's ID existing
   * in public.admin_users.
   */

  const {
    data: admin,
    error: adminError,
  } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (adminError) {
    console.error(
      "Admin lookup error:",
      adminError,
    );

    /*
     * If the admin lookup fails, do NOT accidentally
     * grant admin access.
     *
     * Treat the user as a normal user.
     */

    redirectResponse.headers.set(
      "Location",
      `${origin}${safeNext}`,
    );

    return redirectResponse;
  }

  const isAdmin = Boolean(admin);

  console.log(
    "Admin:",
    isAdmin,
  );

  /*
   * =========================================================
   * DETERMINE FINAL DESTINATION
   * =========================================================
   *
   * ADMIN:
   *     Always /admin
   *
   * NORMAL USER:
   *     Use ?next= if it is a safe internal path.
   */

  const destination = isAdmin
    ? "/admin"
    : safeNext;

  console.log(
    "Redirecting to:",
    destination,
  );

  /*
   * =========================================================
   * UPDATE LOCATION ON SAME RESPONSE
   * =========================================================
   *
   * IMPORTANT:
   *
   * Do NOT create another NextResponse.redirect here.
   *
   * The existing redirectResponse contains the Supabase
   * authentication cookies created during
   * exchangeCodeForSession().
   */

  redirectResponse.headers.set(
    "Location",
    `${origin}${destination}`,
  );

  return redirectResponse;
}