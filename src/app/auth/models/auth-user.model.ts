export class AuthUser
{
  constructor(
    public id: string,
    public userName: string,
    public role: string,
    public _token: string,
    public _expiresIn: Date //in seconds
  ) { }

  get token()
  {
    if (!this._expiresIn || new Date() > this._expiresIn) {
/*      alert("session expired, please log in again.")*/
      return null;
    }
    return this._token;
  }
}
