
export class ReplyResponse
{
  constructor(
    public error: string,
    public ticketId: number,
    public userId: string,
    public userName: string,
    public message: string,
    public date: Date,
    public isImageAttached: boolean,
    public replyId: number,
    public imagePath: string,
    public isInnerReply: boolean
  ) { }
}
