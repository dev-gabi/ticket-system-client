import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/auth.service';
import { CanFormDeactivate } from '../../../auth/guards/form-deactivate.guard';
import { DestroyPolicy } from '../../../utils/destroy-policy';
import { Ticket } from '../../models/ticket.model';
import { TicketService3 } from '../../ticket.service3';

@Component({
  selector: 'app-add-reply',
  templateUrl: './add-reply.component.html'
})
export class AddReplyComponent extends DestroyPolicy implements OnInit, CanFormDeactivate
{

  constructor(
    private ticketService: TicketService3,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
    ) { super(); }

  form: FormGroup;
  @Input() ticket: Ticket;
  @Input() isCustomer: boolean;
  confirmSubject = new Subject<boolean>();
  isSaved = false;
  isConfirmDialogOpen = false;
  open = environment.ticketStatus.open;



  ngOnInit(): void
  {  
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
