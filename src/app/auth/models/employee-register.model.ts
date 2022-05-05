export class EmployeeRegisterModel {
  constructor(
    public password: string,
    public confirmPassword: string,
    public phoneNumber: string,
    public resetToken: string,
    public email: string,
    public userName:string
  ) {  }
}
