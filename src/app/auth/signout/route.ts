import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Signout error:",
        error,
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Signout route error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to sign out.",
      },
      {
        status: 500,
      },
    );
  }
}