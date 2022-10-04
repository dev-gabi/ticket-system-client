import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/auth.service';
import { CanFormDeactivate } from '../../../auth/guards/form-deactivate.guard';
import { DestroyPolicy } from '../../../utils/destroy-policy';
import { Ticket } from '../../models/ticket.model';
import { TicketsQuery } from '../../store/tickets-query';
import { TicketService3 } from '../../ticket.service3';

@Component({
  selector: 'app-add-reply',
  templateUrl: './add-reply.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddReplyComponent extends DestroyPolicy implements OnInit, CanFormDeactivate
{
  constructor(
    private ticketService: TicketService3,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private query: TicketsQuery,
    private authService: AuthService
    ) { super(); }

  form: FormGroup;
  ticket: Ticket;
  isCustomer: boolean;
  confirmSubject = new Subject<boolean>();
  isSaved = false;
  isConfirmDialogOpen = false;
  open = environment.ticketStatus.open;
  @Output() cancel = new EventEmitter<void>();

  ngOnInit(): void
  {
    this.isCustomer = this.authService.getLoggedInUser().role === environment.roles.customer;
    this.ticket = this.query.getActive() as Ticket;
    this.setForm();
  }
  setForm()
  {
    this.form = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(5)]],
      isInnerReply:false,
      imageFile: null
    })
  }
  onAddReply()
  {
    this.isSaved = true;
    let isInnerReply;
    this.form.get('isInnerReply').value ? isInnerReply = true : isInnerReply = false;
    this.ticketService.addReply(this.ticket.id, this.form.get('message').value, isInnerReply, this.form.get('imageFile').value).pipe(
      takeUntil(this.destroy$),
    ).subscribe();

    this.form.reset();
  }

  openConfirmDialog()
  {
    this.isConfirmDialogOpen = true;
    this.cdr.markForCheck();
  };
  onConfirm(isConfirmed: boolean)
  {
    this.confirmSubject.next(isConfirmed);
    this.isConfirmDialogOpen = false;
  }
  onCloseAlert()
  {
    this.ticketService.clearError();
  }
}
