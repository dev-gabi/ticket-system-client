import { ReplyImage } from './reply-image.model';

export class TicketReply
{
  constructor(
    public id:number,
    public ticketId: number,
    public userId: string,
    public userName: string,
    public message: string,
    public date: Date,
    public isImageAttached: boolean,
    public image: ReplyImage,
    public isInnerReply: boolean
  ) { }
}
