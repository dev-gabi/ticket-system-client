import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';
import { Ticket } from '../models/ticket.model';
import { TicketService2 } from '../ticket.service2';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketListComponent implements OnInit
{
  constructor(private ticketService2: TicketService2, private authService: AuthService)
  {  }

  tickets$: Observable<Ticket[]>;
  isCustomer: boolean;
  pageOfTickets$: Observable<any>;
  customerRole = environment.roles.customer;
  userRole: string;

  ngOnInit()
  {
    this.ticketService2.init();
    this.userRole = this.authService.user.value.role;
    this.isCustomer = this.userRole === this.customerRole;

    this.tickets$ = this.ticketService2.tickets$;
    this.onChangePage(this.tickets$.pipe(map(items => items.slice(0, 10))));
  }

  onDisplayAllTickets()
  {
    this.ticketService2.fetchTickets(this.userRole);
  }
  onDisplayOpenTickets()
  {
    this.ticketService2.fetchTickets(this.userRole, environment.ticketStatus.open);
  }
  onChangePage(pageOfTickets: Observable<any>)
  {
    this.pageOfTickets$ = pageOfTickets;
  }

  onFilterByCategory(category: string)
  {
    this.tickets$ = this.ticketService2.filterByCategory(category);
    this.onChangePage(this.tickets$);
  }
}
