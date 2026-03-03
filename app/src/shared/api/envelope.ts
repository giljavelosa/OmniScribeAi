export type ApiOk<T> = {
  success: true;
  data: T;
  requestId: string;
};

export type ApiFail = {
  success: false;
  error: {
    code: string;
    message: string;
    requestId: string;
  };
  requestId: string;
};

export type ApiResponse<T> = ApiOk<T> | ApiFail;

export function ok<T>(data: T, requestId: string): ApiOk<T> {
  return { success: true, data, requestId };
}

export function fail(code: string, message: string, requestId: string): ApiFail {
  return { success: false, error: { code, message, requestId }, requestId };
}
