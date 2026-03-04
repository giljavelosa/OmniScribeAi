import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStyleProfileForUser, getRecentStyleFeedbackEvents } from "@/lib/style-learning";
import { appLog, scrubError } from "@/lib/logger";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const [profile, recentEvents] = await Promise.all([
      getStyleProfileForUser(session.user.id),
      getRecentStyleFeedbackEvents(session.user.id, 20),
    ]);

    return NextResponse.json({
      success: true,
      profile: profile ?? null,
      recentEvents,
    });
  } catch (err) {
    appLog("error", "GET /api/style-learning/profile", scrubError(err));
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
