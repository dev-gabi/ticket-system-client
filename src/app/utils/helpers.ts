import { environment } from '../../environments/environment';
import { BaseUser } from '../shared/base-user.model';

export class Helpers
{

  public static extractArrayOfProp(array: any, propName: string)
  {
    if (array == null) return [];
    var output = [];
    const length = array.length;
    for (var i = 0; i < length; ++i)
      output.push(array[i][propName]);
    return output;
  }


  public static limitBaseUsersResult(users:BaseUser[])
  {

    if (users.length > environment.typeAhead.resultNumDisplay) {
      const diff = users.length - environment.typeAhead.resultNumDisplay;
      users.splice(0, diff);
      const moreResults: BaseUser = { id: null, name: `And ${diff} more results.`, role: null, isActive: false };
      users.push(moreResults);      
    }
    return users;
  }

  public static detectWindowWidth() {
    return window.innerWidth < 900;
  }
} 


