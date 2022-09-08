
import { ApiResponse } from './api-response.model';

export interface LoginResponse extends ApiResponse
{
  id: string;
  userName: string;
  role: string;
  token: string;
  expireInSeconds: string;

}
