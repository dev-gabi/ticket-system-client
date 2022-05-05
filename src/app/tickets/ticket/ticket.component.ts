import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';
import { Ticket } from '../models/ticket.model';
import { TicketService } from '../ticket.service';


@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html'
})
export class TicketComponent implements OnInit
{
  constructor(private ticketService: TicketService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ticket: Ticket;
  ticketId: number;
  paramsIdSub: Subscription;
  ticketChangedSub: Subscription;
  subscriptions: Subscription[] = [];
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
    this.paramsIdSub = this.route.params.subscribe((params: Params) =>
    {
      this.ticketId = +params['id'];
      this.ticket = this.ticketService.getById(this.ticketId);

    })

    this.ticketChangedSub = this.ticketService.selectedTicket.subscribe((ticket: Ticket) =>
    {
      this.ticket = ticket;
    });
    this.subscriptions.push(this.paramsIdSub, this.ticketChangedSub);
  }

  onAddReply(formData: { reply: string, innerReplyChecked:boolean })
  {
    let isInnerReply;
    !formData.innerReplyChecked ? isInnerReply = false : isInnerReply = true;

    this.ticketService.addReply(this.ticket.id, formData.reply, isInnerReply, this.imageFile).subscribe(
      ticket =>
      {
        this.ticket = ticket;

      }
      ,error =>
      {
        this.responseMessage = error;
      }
    );
    this.imageFile = null;
    this.addReplyForm.reset();
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
    this.ticketService.closeTicket(this.ticketId).subscribe(
      response =>
      {
        this.responseMessage = response.message;
      },
      error =>
      {
        this.responseMessage = error;
      }
    );
    this.confirmCloseTicket = false;
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  ngOnDestroy()
  {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
