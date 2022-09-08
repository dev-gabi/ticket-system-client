export interface ResetPassword
{
  newPassword: string;
  confirmPassword: string;
  userId: string;
  resetToken: string;
}
