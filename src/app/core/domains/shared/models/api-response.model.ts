export interface ApiResponse<T> {
  message: string;
  id?: string;
  data: T;
  timestamp: string;
}
