import { TicketReply } from '../ticket-reply.model';
import { Ticket } from '../ticket.model';

export interface TicketResponse extends Ticket
{
  customerName: string;
 // error: string;
}
/*
export class TicketResponse extends Ticket
{
  constructor(
    public id: number,
    public customerId: string,
    public customerName: string,
    public category:string,
    public title: string,
    public replies: TicketReply[],
    public status: string,
    public openDate: Date,
    public closingDate: Date,
    public closedByUser: string,
    public error:string
  )
  {
    super(id, customerId, category, title, replies, status, openDate, closingDate, closedByUser)
  }
}
*/
