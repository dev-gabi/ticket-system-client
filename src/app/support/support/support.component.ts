import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ticket } from '../../tickets/models/ticket.model';
import { TicketService } from '../../tickets/ticket.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html'
})
export class SupportComponent implements OnInit, OnDestroy
{
  constructor(private ticketService: TicketService) { }

  openTickets: Ticket[];
  updatedTicketsSub: Subscription;

  ngOnInit()
  {
    this.updatedTicketsSub = this.ticketService.updatedTickets.pipe(
      map((tickets: Ticket[]) => { return tickets.filter(t => t.status === 'open') })
    ).subscribe(
      tickets =>  this.openTickets
    );
  }

  ngOnDestroy()
  {
    this.updatedTicketsSub.unsubscribe();
  }
}
