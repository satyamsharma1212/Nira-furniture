import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");

  const next =
    url.searchParams.get("next") || "/account";

  /*
   * Only allow internal paths.
   * Prevent an external redirect such as:
   *
   * https://malicious-site.com
   */
  const safeNext = next.startsWith("/")
    ? next
    : "/account";

  const origin = url.origin;

  /*
   * No OAuth code means authentication
   * did not complete.
   */
  if (!code) {
    console.error(
      "OAuth callback: missing code",
    );

    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(
        "Authentication failed. No authorization code was received.",
      )}`,
    );
  }

  /*
   * Create the response FIRST.
   *
   * Supabase will write the authentication
   * cookies onto this exact response.
   */
  const redirectResponse =
    NextResponse.redirect(
      `${origin}${safeNext}`,
    );

  /*
   * Create a Supabase SSR client using
   * the cookies from the incoming request.
   */
  const supabase =
    createServerClient(
      process.env
        .NEXT_PUBLIC_SUPABASE_URL!,
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
   * Exchange Google's OAuth code for
   * a Supabase authenticated session.
   *
   * IMPORTANT:
   * This also causes Supabase to generate
   * the auth cookies that are attached to
   * redirectResponse above.
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
   * Make sure a session was actually created.
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

  console.log(
    "OAuth login successful:",
    data.user.email,
  );

  /*
   * IMPORTANT:
   *
   * Return the SAME response on which the
   * Supabase authentication cookies were set.
   */
  return redirectResponse;
}