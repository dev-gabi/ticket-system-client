export class ApiResponse
{
    constructor(
      public message: string,
      public isSuccess: boolean,
      public statusCode:string,
      public statusCodeTitle:string,
      public errors?: string[]
    ) { }
}
