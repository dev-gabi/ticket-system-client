export class AddTicketRequest
{
  constructor(
    public title: string,
    public message: string,
    public category:string,
    public image? :File

  ) { }
}
