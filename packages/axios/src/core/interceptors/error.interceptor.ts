import type { AxiosInstance, AxiosResponse } from "axios";
import axios from "axios";
import { ApiError } from "../ApiError.js";

/**
 * Map of HTTP status codes to human-readable error code strings.
 */
const HTTP_STATUS_CODES: Record<number, string> = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  405: "METHOD_NOT_ALLOWED",
  408: "REQUEST_TIMEOUT",
  409: "CONFLICT",
  410: "GONE",
  413: "PAYLOAD_TOO_LARGE",
  415: "UNSUPPORTED_MEDIA_TYPE",
  422: "UNPROCESSABLE_ENTITY",
  429: "TOO_MANY_REQUESTS",
  500: "INTERNAL_SERVER_ERROR",
  502: "BAD_GATEWAY",
  503: "SERVICE_UNAVAILABLE",
  504: "GATEWAY_TIMEOUT",
};

/**
 * @internal
 * Sets up a centralized error interceptor on the given Axios instance.
 *
 * Converts all Axios errors into `ApiError` instances so consumers
 * always receive a consistent, typed error interface.
 */
export function setupErrorInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: unknown) => {
      // Already an ApiError (e.g. from auth interceptor) → rethrow as-is
      if (error instanceof ApiError) {
        throw error;
      }

      if (!axios.isAxiosError(error)) {
        throw new ApiError({
          message: error instanceof Error ? error.message : "An unknown error occurred",
          status: 0,
          code: "UNKNOWN_ERROR",
          originalError: error,
        });
      }

      // ─── Cancelled Request ──────────────────────────────────────────────
      if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
        throw new ApiError({
          message: "Request was cancelled",
          status: 0,
          code: "REQUEST_CANCELLED",
          originalError: error,
        });
      }

      // ─── Response Error (server responded with an error status) ─────────
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data as Record<string, unknown> | undefined;

        // Try to extract error code from response body, fallback to HTTP status string
        const code =
          (responseData && typeof responseData.code === "string"
            ? responseData.code
            : undefined) ??
          HTTP_STATUS_CODES[status] ??
          `HTTP_${status}`;

        const message =
          (responseData && typeof responseData.message === "string"
            ? responseData.message
            : undefined) ??
          error.message ??
          "Request failed";

        throw new ApiError({
          message,
          status,
          code,
          data: responseData ?? null,
          originalError: error,
        });
      }

      // ─── Request Error (no response received — network failure) ─────────
      if (error.request) {
        throw new ApiError({
          message: error.message ?? "Network error — no response received",
          status: 0,
          code: "NETWORK_ERROR",
          originalError: error,
        });
      }

      // ─── Unknown Axios Error ────────────────────────────────────────────
      throw new ApiError({
        message: error.message ?? "An unknown error occurred",
        status: 0,
        code: "UNKNOWN_ERROR",
        originalError: error,
      });
    }
  );
}
