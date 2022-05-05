import { TicketReply } from './ticket-reply.model';
export class Ticket
{
  constructor(
    public id: number,
    public customerId: string,
    public category:string,
    public title: string,
    public replies: TicketReply[],
    public status: string,
    public openDate: Date,
    public closingDate: Date,
    public closedByUser: string
  ) { }
}
