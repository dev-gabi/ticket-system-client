import { User } from '../shared/user.model';


export class Admin extends User
{
  constructor(public id: string,
    public name: string,
    public role: string,
    public email: string,
    public isActive: boolean,
    public registrationDate: Date
  )
  {
    super(id, name, role, email, isActive, registrationDate)
  }
}
