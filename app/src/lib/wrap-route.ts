import { NextResponse } from "next/server";
import { wrapRoute as sharedWrapRoute } from "@/shared/api/routeWrapper";

export const wrapRoute = sharedWrapRoute;

export function withNoStore(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "no-store");
  return response;
}
