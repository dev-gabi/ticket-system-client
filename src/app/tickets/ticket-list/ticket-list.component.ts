import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TicketService } from 'src/app/tickets/ticket.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';
import { Ticket } from '../models/ticket.model';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls:['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit, OnDestroy
{
  constructor(private ticketService: TicketService, private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  tickets: Ticket[] = [];
  isCustomer: boolean;
  pageOfTickets: Array<any>;
  customerRole = environment.roles.customer;
  userRole: string;
  ticketsSub: Subscription;
  resolverSub: Subscription

  ngOnInit()
  {
    this.userRole = this.authService.user.value.role;
    this.isCustomer = this.userRole === this.customerRole;

    this.resolverSub = this.route.data.subscribe(
      (data: Data) =>
      {
        this.tickets = data['tickets'];
      }
    );
    this.ticketsSub = this.ticketService.updatedTickets.subscribe(
      (tickets: Ticket[]) =>
      {
        this.tickets = tickets;
      }) 
  }

  onDisplayTicketsByUser(customerTickets :Ticket[])
  {
    this.tickets = customerTickets;
    this.router.navigate(['/support']);
  }

  onDisplayAllTickets()
  {
    this.tickets = this.ticketService.fetchAllTickets(this.userRole);
  }
  onChangePage(pageOfTickets: Array<any>)
  {
    this.pageOfTickets = pageOfTickets;
  }

  ngOnDestroy(): void
  {
    this.ticketService.clearTicketsFromMemory();
    this.ticketsSub.unsubscribe();
    this.resolverSub.unsubscribe();
  }

}
