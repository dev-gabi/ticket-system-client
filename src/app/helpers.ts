export class Helpers
{

  public static extractArrayOfProp(array: any, propName: string)
  {
    if (array == null) return [];
    var output = [];
    for (var i = 0; i < array.length; ++i)
      output.push(array[i][propName]);
    return output;
  }

} 


