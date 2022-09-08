import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent
{

  @Output('isConfirmed') isConfirmed = new EventEmitter<boolean>();
  @Input('question') question: string;

  onConfirm(isConfirm: boolean)
  {
   
    this.isConfirmed.emit(isConfirm);
  }

}
