import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';
import { Ticket } from '../models/ticket.model';
import { TicketService2 } from '../ticket.service2';


@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketComponent implements OnDestroy, OnInit
{
  constructor(private ticketService2: TicketService2, private route: ActivatedRoute,
     private authService: AuthService, private cdr: ChangeDetectorRef) { }

  ticket$: Observable<Ticket>;
  ticketId: number;
  destroy$: Subject<boolean> = new Subject<boolean>();
  open = environment.ticketStatus.open;
  closed = environment.ticketStatus.closed;
  isCustomer: boolean;
  imageFile: File;
  responseMessage: string = null;


  @ViewChild('addReplyForm') addReplyForm: NgForm;
  confirmCloseTicket = false;
  confirmQuestion = "Are you sure you want to close this ticket?";
  ngOnInit(): void
  {
   
    this.isCustomer = this.authService.user.value.role === environment.roles.customer;
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(
      (params: Params) =>
      {
        this.ticketId = +params['id'];
        this.ticket$ = this.ticketService2.getSelectedTicket(this.ticketId);
        this.cdr.markForCheck();
   
      }
    )

    this.ticketService2.error$.pipe(takeUntil(this.destroy$)).subscribe(
      error =>
      {
        this.responseMessage = error;
        this.cdr.markForCheck();
      }
    )
  }

  onAddReply(formData: { reply: string, innerReplyChecked: boolean })
  {
    let isInnerReply;
    formData.innerReplyChecked ? isInnerReply = true:  isInnerReply = false;
    this.ticket$ = this.ticketService2.addReply(this.ticketId, formData.reply, isInnerReply, this.imageFile);
    //this.imageFile = null;
   // this.addReplyForm.reset();
  }
  setFile(fileOutput: File)
  {
    this.imageFile = fileOutput;
  }
  onCloseTicket()
  {
    this.confirmCloseTicket = true;
  }
  onCloseConfirm()
  {
    this.confirmCloseTicket = false;
  }
  onCloseAlert()
  {
    this.responseMessage = null;
  }
  onConfirm()
  {
    this.ticket$ = this.ticketService2.closeTicket(this.ticketId);
    this.confirmCloseTicket = false;
  //  this.router.navigate(["../"], { relativeTo: this.route }); //causes exception 
  }

  ngOnDestroy()
  {

    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
