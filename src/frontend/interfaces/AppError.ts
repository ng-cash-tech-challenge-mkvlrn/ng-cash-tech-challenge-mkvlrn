export interface AppError {
  statusCode: number;
  type: string;
  details: string[];
  message: string;
}
