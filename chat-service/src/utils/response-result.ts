export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface ResultResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
}
