export class ResetPassword
{
  constructor(
    public newPassword: string,
    public confirmPassword: string,
    public userId: string,
    public resetToken:string
  ) { }
}
