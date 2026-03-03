import { NextRequest, NextResponse } from "next/server";
import { ok, fail, type ApiResponse } from "@/shared/api/envelope";
import { AppError, toAppError } from "@/shared/errors/AppError";
import { ERROR_CODES } from "@/shared/errors/codes";
import { logger } from "@/shared/observability/logger";
import { REQUEST_ID_HEADER, getRequestIdFromHeaders } from "@/shared/observability/requestId";
import { validateEnv } from "@/shared/validation/env";

type Handler<TContext = unknown, TData = unknown> = (
  req: NextRequest,
  ctx: TContext,
  requestId: string,
) => Promise<TData | ApiResponse<TData> | Response>;

function withRequestId(response: Response, requestId: string): Response {
  response.headers.set(REQUEST_ID_HEADER, requestId);
  return response;
}

export function wrapRoute<TContext = unknown, TData = unknown>(handler: Handler<TContext, TData>) {
  return async (req: NextRequest, ctx: TContext): Promise<Response> => {
    const requestId = getRequestIdFromHeaders(req);

    try {
      validateEnv();
      const result = await handler(req, ctx, requestId);

      if (result instanceof Response) {
        return withRequestId(result, requestId);
      }

      if (result && typeof result === "object" && "success" in result) {
        const existing = result as ApiResponse<TData>;
        const response = NextResponse.json(existing);
        return withRequestId(response, requestId);
      }

      const response = NextResponse.json(ok(result as TData, requestId));
      return withRequestId(response, requestId);
    } catch (error) {
      const appError = toAppError(error);
      logger.error("Route failure", {
        requestId,
        code: appError.code,
        status: appError.httpStatus,
      });
      const status = appError instanceof AppError ? appError.httpStatus : 500;
      const code = appError.code || ERROR_CODES.UNKNOWN;
      const response = NextResponse.json(
        fail(code, appError.safeMessage || "Internal server error", requestId),
        { status },
      );
      return withRequestId(response, requestId);
    }
  };
}
