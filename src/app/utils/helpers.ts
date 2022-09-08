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
   
    const resultLength = users.length;

    if (resultLength > environment.typeAhead.resultNumDisplay) {
      const resultsNumtoRemove = resultLength - environment.typeAhead.resultNumDisplay;
      users.splice(0, resultsNumtoRemove);
      const moreResults: BaseUser = { id: null, name: `And ${resultsNumtoRemove} more results.`, role: null, isActive: false };
      users.push(moreResults);      
    }
    return users;
  }

} 


