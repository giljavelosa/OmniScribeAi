import { NextResponse } from "next/server";

type ContractMeta = {
  requestId?: string;
  timestamp?: string;
};

type BaseOptions = {
  headers?: HeadersInit;
  meta?: ContractMeta;
};

type OkOptions = BaseOptions & {
  status?: number;
};

type FailOptions = BaseOptions & {
  retryable?: boolean;
  details?: unknown;
};

function withMeta(meta?: ContractMeta) {
  return {
    ...(meta?.requestId ? { requestId: meta.requestId } : {}),
    timestamp: meta?.timestamp ?? new Date().toISOString(),
  };
}

export function ok<T>(data: T, options?: OkOptions) {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: withMeta(options?.meta),
    },
    {
      status: options?.status ?? 200,
      headers: options?.headers,
    },
  );
}

export function fail(
  code: string,
  message: string,
  status: number,
  options?: FailOptions,
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        retryable: options?.retryable ?? false,
        details: options?.details ?? {},
      },
      meta: withMeta(options?.meta),
    },
    {
      status,
      headers: options?.headers,
    },
  );
}
