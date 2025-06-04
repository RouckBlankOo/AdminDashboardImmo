export interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  request?: unknown;
  config?: unknown;
}
