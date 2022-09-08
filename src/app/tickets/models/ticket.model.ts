import { TicketReply } from './ticket-reply.model';
export interface Ticket
{
  id: number;
  customerId: string;
  category: string;
  title: string;
  replies: TicketReply[];
  status: string;
  openDate: Date;
  closingDate: Date;
  closedByUser: string;
}
//export class Ticket
//{
//  constructor(
//    public id: number,
//    public customerId: string,
//    public category:string,
//    public title: string,
//    public replies: TicketReply[],
//    public status: string,
//    public openDate: Date,
//    public closingDate: Date,
//    public closedByUser: string
//  ) { }
//}
