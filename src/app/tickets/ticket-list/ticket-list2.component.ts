import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';
import { DestroyPolicy } from '../../utils/destroy-policy';
import { Ticket } from '../models/ticket.model';
import { TicketsQuery } from '../store/tickets-query';
import { TicketService3 } from '../ticket.service3';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketListComponent extends DestroyPolicy implements OnInit
{
  constructor(private ticketService: TicketService3,
    private authService: AuthService, private ticketsQuery: TicketsQuery, private cdr: ChangeDetectorRef)
  { super(); }

  tickets$: Observable<Ticket[]> = this.ticketService.filteredTickets$;
  error$: Observable<string>;
  isCustomer: boolean;
  pageOfTickets$: Observable<any>;  
  customerRole = environment.roles.customer;
  userRole: string;
  isLoading = false;

  ngOnInit()
  {
    this.ticketService.init();
    this.userRole = this.authService.getLoggedInUser().role;
    this.isCustomer = this.userRole === this.customerRole;
    this.subscribeAndLoadOpenTickets();
    this.error$ = this.ticketService.error$;
  }

  subscribeAndLoadOpenTickets()
  {   
      this.ticketsQuery.selectedIsOpenTicketsLoaded$.pipe(
        filter(isLoaded => { return !isLoaded }),
        switchMap((isLoaded) =>
        {
            this.isLoading = true;
            return this.ticketService.fetchTickets(this.userRole, environment.ticketStatus.open);         
        }),
        map(tickets=>tickets.splice(0,10)),
        takeUntil(this.destroy$),
      ).subscribe((t) =>
      {
        this.ticketService.filterByStatus(environment.ticketStatus.open);
        this.onChangePage(of(t));//first loading of tickets to store
        this.isLoading = false;
        this.cdr.markForCheck();
      });
  }

  reFetchTickets()
  {
    this.ticketService.clearTicketsStore();
    this.ticketService.filterByStatus(environment.ticketStatus.open);  
  }

  onChangePage(pageOfTickets: Observable<any>)
  {
    this.pageOfTickets$ = pageOfTickets;
    this.cdr.detectChanges()
  }

  onCloseAlert()
  {
    this.ticketService.clearError();
  }
}
