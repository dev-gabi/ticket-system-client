import { BaseUser } from './base-user.model';

export interface User extends BaseUser
{
  registrationDate: Date;
  email: string;
}
//export abstract class User extends BaseUser
//{
//  constructor(
//    public id: string,
//    public name: string,
//    public role: string,
//    public email: string,
//    public isActive: boolean,
//    public registrationDate:Date
//  )
//  {
//    super(id, name, role, isActive)
//  }

//}
