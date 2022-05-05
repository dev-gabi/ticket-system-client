
import { ApiResponse } from './api-response.model';

export class LoginResponse extends ApiResponse
{
  constructor(
    public message: string,
    public isSuccess: boolean,
    public statusCode: string,
    public statusCodeTitle: string,
    public id:string,
    public userName: string,
    public role: string,
    public token: string,
    public expireInSeconds: string,
    public errors?: string[],
  )
  {
    super(message, isSuccess, statusCode, statusCodeTitle, errors);
  }
}
