import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
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

  tickets$: Observable<Ticket[]> = this.ticketsQuery.selectAll();//.pipe(takeUntil(this.destroy$));
  error$: Observable<string>;
  isCustomer: boolean;
  pageOfTickets$: Observable<any>;
  closedSub: Subscription;
  customerRole = environment.roles.customer;
  userRole: string;
  isClosedTicketsFetched = false;

  ngOnInit()
  {
    this.ticketService.setUserId();
    this.userRole = this.authService.getLoggedInUser().role;
    this.isCustomer = this.userRole === this.customerRole;
    this.checkIfOpenTicketsLoaded();
    this.error$ = this.ticketService.error$;
    this.subscribeTypeAheadTickets();
    this.onChangePage(this.tickets$.pipe(map(tickets => tickets.slice(0, 10))));
  }

  subscribeTypeAheadTickets()
  {
    this.ticketService.typeAheadTickets$.pipe(
      takeUntil(this.destroy$)).subscribe(
        tickets$ =>
        {
          this.tickets$ = tickets$;
          this.cdr.detectChanges();
        }
      );
  }

  checkIfOpenTicketsLoaded()
  {
    if (this.ticketsQuery.selectedIsOpenTicketsLoaded$) {
      this.ticketsQuery.selectedIsOpenTicketsLoaded$.pipe(
        filter(isLoaded => { return !isLoaded }),
        switchMap((isLoaded) =>
        {
          return this.ticketService.fetchTickets(this.userRole, environment.ticketStatus.open)
        }),
        takeUntil(this.destroy$),
      ).subscribe();
    }

  }


  checkIfClosedTicketsLoaded(status: string)
  {
    this.closedSub = this.ticketsQuery.selectedIsClosedTicketsLoaded$.pipe(
      filter(isLoaded => { return !isLoaded }),
      switchMap((isLoaded) =>
      {
        return this.ticketService.fetchTickets(this.userRole, environment.ticketStatus.closed)
      }),
      takeUntil(this.destroy$)
    ).subscribe(() =>
    {
      this.isClosedTicketsFetched = true;
      this.tickets$ = this.ticketService.filterByStatus(status);
      this.onChangePage(this.tickets$.pipe(map(tickets => tickets.slice(0, 10))));
    });
  }

  /**
 * if status!= 'open'
 * subscribe to isClosedTicketsLoaded$ in tickets query.
 * fetch closed tickets from server and add them to the store.
 * returns tickets with selected status.
 */
  onQueryByStatus(status: string)
  {
    if (status != environment.ticketStatus.open && !this.isClosedTicketsFetched) {
      this.checkIfClosedTicketsLoaded(status);
    }
    else {
      this.tickets$ = this.ticketService.filterByStatus(status);
      this.onChangePage(this.tickets$.pipe(map(tickets => tickets.slice(0, 10))));
    }
 
  }

  onQueryByCategory(category: string)
  {

    this.tickets$ = this.ticketService.filterByCategory(category);
    this.onChangePage(this.tickets$.pipe(map(tickets => tickets.slice(0, 10))));
  }

  reFetchTickets()
  {
    if (this.closedSub) {
      this.closedSub.unsubscribe();
    }

    this.ticketService.clearTicketsStore();
    this.isClosedTicketsFetched = false;
    this.onQueryByStatus(environment.ticketStatus.open);
  }


  onChangePage(pageOfTickets: Observable<any>)
  {
    this.pageOfTickets$ = pageOfTickets;
  }

  onCloseAlert()
  {
    this.ticketService.clearError();
  }

}
