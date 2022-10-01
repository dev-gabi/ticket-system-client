import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../auth/auth.service';
import { DestroyPolicy } from '../../../../utils/destroy-policy';
import { TicketsQuery } from '../../../store/tickets-query';
import { TicketService3 } from '../../../ticket.service3';

@Component({
  selector: 'app-status-select',
  templateUrl: './status-select.component.html'
})
export class StatusSelectComponent extends DestroyPolicy implements OnInit
{

  constructor(
    private ticketsQuery: TicketsQuery,
    private ticketService: TicketService3,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { super(); }

  statusOpt = [environment.ticketStatus.open, environment.ticketStatus.closed, environment.ticketStatus.all];

  isClosedTicketsFetched: boolean;
  isLoading = false;
  userRole: string;

  ngOnInit()
  {
    this.userRole = this.authService.getLoggedInUser().role;
    this.subscribeCheckIsClosedTicketsLoaded();
  }

  subscribeCheckIsClosedTicketsLoaded()
  {
    this.ticketsQuery.selectedIsClosedTicketsLoaded$.pipe(takeUntil(this.destroy$)).subscribe(
      isClosedTicketsLoaded => this.isClosedTicketsFetched = isClosedTicketsLoaded
    );
  }
  /**
  * if status!= 'open'
  * subscribe to isClosedTicketsLoaded$ in tickets query.
  * fetch closed tickets from server and add them to the store.
  * returns tickets with selected status.
  */
  onSelectStatus(status: string)
  {
    if (status != environment.ticketStatus.open && !this.isClosedTicketsFetched) {
      this.subscribeAndLoadClosedTickets(status);
    }
    else {
      this.ticketService.filterByStatus(status);
    }
  }

  subscribeAndLoadClosedTickets(status: string)
  {
    this.ticketsQuery.selectedIsClosedTicketsLoaded$.pipe(
      filter(isLoaded => { return !isLoaded }),
      switchMap((isLoaded) =>
      {
        this.isLoading = true;
        return this.ticketService.fetchTickets(this.userRole, environment.ticketStatus.closed)
      }),
      takeUntil(this.destroy$)
    ).subscribe(() =>
    {
      this.ticketService.filterByStatus(status);
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }
}
