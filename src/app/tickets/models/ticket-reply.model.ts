import { ReplyImage } from './reply-image.model';
export interface TicketReply
{
     id: number;
     ticketId: number;
     userId: string;
     userName: string;
     message: string;
     date: Date;
     isImageAttached: boolean;
     image: ReplyImage;
  isInnerReply: boolean;
}
//export class TicketReply
//{
//  constructor(
//    public id:number,
//    public ticketId: number,
//    public userId: string,
//    public userName: string,
//    public message: string,
//    public date: Date,
//    public isImageAttached: boolean,
//    public image: ReplyImage,
//    public isInnerReply: boolean
//  ) { }
//}
