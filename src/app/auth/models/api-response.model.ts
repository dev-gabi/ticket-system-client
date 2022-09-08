export interface ApiResponse
{
  message: string;
  isSuccess: boolean;
  statusCode: string;
  statusCodeTitle: string;
  errors?: string[];
}
