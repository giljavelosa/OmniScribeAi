import { auth } from "@/lib/auth";
import { appLog } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

/**
 * Audio chunk receiver — acknowledges receipt for the client UI counter.
 *
 * NOTE: Server-side audio storage is INTENTIONALLY disabled pending:
 *  1. Signed BAA with DigitalOcean (infrastructure)
 *  2. AES-256 encryption implementation for PHI at rest
 *
 * Audio is safely preserved in the browser's in-memory chunks array until
 * recording stops and the assembled blob is submitted for transcription.
 * The client-side "Download Recording" button on the error screen provides
 * an emergency fallback if processing fails.
 *
 * See HIPAA-PHI-BOUNDARY.md §6.3 for rationale.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.formData();
    const sessionId  = (body.get("sessionId")  as string | null) ?? "";
    const chunkIndex = parseInt((body.get("chunkIndex") as string | null) ?? "-1", 10);
    const chunk      = body.get("chunk") as File | null;

    if (!sessionId || isNaN(chunkIndex) || chunkIndex < 0 || !chunk) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Acknowledge receipt — audio remains in browser memory only (PHI boundary)
    appLog('info', 'RecordingChunk', 'Chunk acknowledged', {
      chunkIndex,
      bytes: chunk.size,
    });

    return NextResponse.json({ success: true, saved: chunkIndex, bytes: chunk.size });

  } catch (err) {
    appLog('error', 'RecordingChunk', 'Error processing chunk', { error: String(err).slice(0, 100) });
    return NextResponse.json({ error: "Chunk processing failed" }, { status: 500 });
  }
}
