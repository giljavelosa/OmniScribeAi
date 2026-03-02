import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { appLog, scrubError } from "@/lib/logger";
import { getRecentStyleFeedbackEvents, getStyleProfileForUser } from "@/lib/style-learning";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [profile, recentEvents] = await Promise.all([
      getStyleProfileForUser(session.user.id),
      getRecentStyleFeedbackEvents(session.user.id),
    ]);

    return NextResponse.json(
      {
        success: true,
        profile: profile
          ? {
              version: profile.version,
              profileJson: profile.profileJson,
              createdAt: profile.createdAt,
              updatedAt: profile.updatedAt,
            }
          : null,
        recentEvents,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    appLog("error", "StyleLearningProfileRoute", "Failed to fetch style profile", {
      error: scrubError(error),
      userId: session.user.id,
    });
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

