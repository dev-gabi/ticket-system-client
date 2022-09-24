import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';
import { DestroyPolicy } from '../../utils/destroy-policy';
import { Ticket } from '../models/ticket.model';
import { TicketService3 } from '../ticket.service3';


@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketComponent extends DestroyPolicy implements OnInit
{
  constructor(private ticketService: TicketService3, private route: ActivatedRoute,
    private authService: AuthService, private cdr: ChangeDetectorRef) { super(); }


  ticket$: Observable<Ticket>;
  error$: Observable<string>;
  ticketId: number;
  open = environment.ticketStatus.open;
  closed = environment.ticketStatus.closed;
  isCustomer: boolean;
  imageFile: File;

  confirmCloseTicket = false;


  ngOnInit(): void
  {
    this.isCustomer = this.authService.getLoggedInUser().role === environment.roles.customer;

    this.ticket$ = this.route.params.pipe(    
      switchMap((params: Params) =>
      {
        this.ticketId = +params['id'];
        return this.ticketService.setActiveTicket(this.ticketId);
      }),
      takeUntil(this.destroy$)
    );
    this.error$ = this.ticketService.error$;
  }


  onCloseAlert()
  {
    this.ticketService.clearError();
  }

  onConfirm(isConfirmed: boolean)
  {
    if (isConfirmed) {
      this.closeTicket();
      this.confirmCloseTicket = false;
    }
  }
  closeTicket()
  {
    this.ticketService.closeTicket(this.ticketId).pipe(
      takeUntil(this.destroy$))
      .subscribe();

    this.ticketService.filterByStatus(environment.ticketStatus.open);
  }

}
