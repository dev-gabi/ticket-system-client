export class AuthLog
{
  constructor(

    public userName: string,
    public date: Date,
    public details: string,
    public action: string
  ) { }
}
