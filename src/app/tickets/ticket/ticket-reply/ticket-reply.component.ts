import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TicketReply } from '../../models/ticket-reply.model';

@Component({
  selector: 'app-ticket-reply',
  templateUrl: './ticket-reply.component.html',
  styleUrls: ['./ticket-reply.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketReplyComponent implements OnInit {

  constructor() { }
  @Input() ticketReply: TicketReply;
  @Input() isCustomer: boolean;
  hide = false;;
  ngOnInit(): void
  {
    if (this.isCustomer && this.ticketReply.isInnerReply)
      this.hide = true;
  }

}
