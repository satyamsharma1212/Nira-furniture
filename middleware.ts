import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(
  request: NextRequest,
) {
  let response =
    NextResponse.next({
      request: {
        headers:
          request.headers,
      },
    });

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

          setAll(
            cookiesToSet,
          ) {
            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                request.cookies.set(
                  name,
                  value,
                );

                response =
                  NextResponse.next({
                    request: {
                      headers:
                        request.headers,
                    },
                  });

                response.cookies.set(
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
   * Refresh the Supabase session.
   *
   * This is important for Server Components,
   * Route Handlers and API routes.
   */
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    /*
     * Run middleware on all application routes
     * except static files and Next internals.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};