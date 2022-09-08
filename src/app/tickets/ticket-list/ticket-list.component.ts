import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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

  tickets$: Observable<Ticket[]> = this.ticketsQuery.selectAll();
  error$: Observable<string>;
  isCustomer: boolean;
  pageOfTickets$: Observable<any>;
  customerRole = environment.roles.customer;
  userRole: string;
  isLoggingOut = false;

  ngOnInit()
  {
    this.ticketService.setUserId();
    this.userRole = this.authService.getLoggedInUser().role;
    this.isCustomer = this.userRole === this.customerRole;
    this.subscribeIsLoggingOut();

    if (!this.isLoggingOut) {
      this.checkIfOpenTicketsLoaded();
    }
    this.error$ = this.ticketService.error$;
    this.subscribeTpeAheadTickets();
    this.onChangePage(this.tickets$.pipe(map(tickets => tickets.slice(0, 10))));
  }

  subscribeTpeAheadTickets()
  {
    this.ticketService.typeAheadTickets$.pipe(
      takeUntil(this.destroy$)).subscribe(
        tickets$ =>
        {
          this.tickets$ = tickets$;
          this.onChangePage(this.tickets$.pipe(map(tickets => tickets.slice(0, 10))));
          this.cdr.detectChanges();
        }
      );
  }

  subscribeIsLoggingOut()
  {
    this.authService.loggingOut.pipe(takeUntil(this.destroy$))
      .subscribe(
      () => this.isLoggingOut = true
    );
  }
  checkIfOpenTicketsLoaded()
  {
    this.ticketsQuery.selectedIsOpenTicketsLoaded$.pipe(
      takeUntil(this.destroy$),
      filter(isLoaded => { return !isLoaded }),
      switchMap((isLoaded) =>
      {
        return this.ticketService.fetchTickets(this.userRole, environment.ticketStatus.open)
      }),
   
    ).subscribe();
  }
  /**
   * if status!= 'open'
   * fetch closed tickets from server and add them to the store.
   * returns tickets with selected status.
   */
  onQueryByStatus(status:string)
  { 
    if (status != environment.ticketStatus.open) {
      this.ticketsQuery.selectedIsClosedTicketsLoaded$.pipe(
        filter(isLoaded => { return !isLoaded }),
        switchMap((isLoaded) =>
        {
          return this.ticketService.fetchTickets(this.userRole, environment.ticketStatus.closed)
        }),
        takeUntil(this.destroy$)
      ).subscribe();

      this.tickets$ = this.ticketService.filterByStatus(status);
    }
    else {
      this.tickets$ = this.ticketService.filterByStatus(status);
    }

    this.onChangePage(this.tickets$.pipe(map(tickets => tickets.slice(0, 10))));
  }

  onQueryByCategory(category: string)
  {
    this.tickets$ = this.ticketService.filterByCategory(category);
    this.onChangePage(this.tickets$.pipe(map(tickets => tickets.slice(0, 10))));
  }

  reFetchTickets()
  {
   this.ticketService.fetchTickets(this.userRole, environment.ticketStatus.open)
      .pipe(takeUntil(this.destroy$))
     .subscribe(() =>
        this.onChangePage(this.tickets$.pipe(map(tickets => tickets.slice(0, 10))))
       );

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
