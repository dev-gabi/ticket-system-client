import { BaseUser } from './base-user.model';

export interface User extends BaseUser
{
  registrationDate: Date;
  email: string;
}

