export class CustomerRegisterModel
{
  constructor(
    public userName: string,
    public email: string,
    public password: string,
    public confirmPassword: string,
    public phoneNumber: string,
    public address: string)
  {  }
}
