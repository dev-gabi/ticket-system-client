import { User } from '../../shared/user.model';
import { SupporterStats } from './supporter-stats-data.model';


export class Supporter extends User
{

  constructor(
    public id: string,
    public name: string,
    public role: string,
    public email: string,
    public isActive: boolean,
    public registrationDate: Date,
    public stats? :SupporterStats[],
    public error? :string
    )
  { super(id, name, role, email, isActive, registrationDate);    }

}
