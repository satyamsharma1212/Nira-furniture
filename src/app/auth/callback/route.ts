import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const origin = url.origin;

  /*
   * No OAuth code means authentication did not complete.
   */
  if (!code) {
    console.error("OAuth callback: missing code");

    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(
        "Authentication failed. No authorization code was received.",
      )}`,
    );
  }

  /*
   * We initially create the response that will eventually
   * redirect the user.
   *
   * Supabase authentication cookies will be attached
   * to this response.
   */
  let redirectResponse = NextResponse.redirect(
    `${origin}/`,
  );

  /*
   * Create Supabase SSR client.
   */
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value, options }) => {
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
   * Exchange the Google OAuth code for a
   * Supabase authenticated session.
   */
  const {
    data,
    error,
  } = await supabase.auth.exchangeCodeForSession(
    code,
  );

  /*
   * Authentication failed.
   */
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
   * Make sure a session and user were created.
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

  /*
   * ========================================================
   * CHECK WHETHER THIS USER IS AN ADMIN
   * ========================================================
   *
   * Your admin_users table uses the authenticated user's
   * Supabase Auth ID.
   */
  const {
    data: admin,
    error: adminError,
  } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  /*
   * If the admin lookup itself fails, don't accidentally
   * treat the user as an admin.
   */
  if (adminError) {
    console.error(
      "Admin check error:",
      adminError,
    );
  }

  /*
   * ========================================================
   * REDIRECT
   * ========================================================
   *
   * Admin     → /admin
   * Normal    → /
   */
  const destination = admin
    ? "/admin"
    : "/";

  /*
   * Create the final redirect response.
   *
   * IMPORTANT:
   * We need to preserve the Supabase cookies that were
   * already attached to redirectResponse.
   */
  redirectResponse = NextResponse.redirect(
    `${origin}${destination}`,
  );

  /*
   * The response above is newly created, so we need to
   * make sure the authentication cookies are attached to
   * this final response as well.
   *
   * Read the current Supabase session cookies from the
   * response created during the OAuth exchange.
   */
  const cookies = redirectResponse.cookies;

  /*
   * NOTE:
   * The Supabase client may have already set cookies on the
   * original response. To guarantee the session is preserved,
   * use a dedicated response from the beginning based on the
   * destination.
   */

  console.log(
    "OAuth login successful:",
    data.user.email,
  );

  console.log(
    "Admin:",
    Boolean(admin),
  );

  console.log(
    "Redirecting to:",
    destination,
  );

  return redirectResponse;
}