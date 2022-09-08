import { User } from '../../shared/user.model';


export interface Customer extends User
{
   address: string;
   phoneNumber: string;
}
//export class Customer extends User
//{
//  constructor(
//   public id: string,
//   public name: string,
//   public role: string,
//   public email:string,
//   public address: string,
//   public phoneNumber: string,
//   public isActive: boolean,
//   public registrationDate:Date
//  )
//  {
//    super(id, name, role, email, isActive, registrationDate);
//  }


//}
