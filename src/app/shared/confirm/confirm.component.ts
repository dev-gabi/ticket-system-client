import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
  animations: [
    trigger('alert-box', [
      state('in', style({
        'opacity': 1,
        'transform': 'translateX(0)'
      })),
      transition('void=>*', [
        animate(300, keyframes([
          style({
            opacity: 0,
            transform: 'translateX(-100px)',
            offset: 0                          //offset 0 is the starting point of time
          }),
          style({
            transform: 'translateX(0px)',
            opacity: 0.5,
            offset: 0.5                       //offset 30 is 30% of the total animation time
          }),
          style({
            transform: 'translateX(-10px)',
            opacity: 1,
            offset: 0.8
          }),
          style({
            transform: 'translateX(0px)',
            opacity: 1,
            offset: 1                       //offset 1 is the final point of animation time
          })
        ]))
      ])
    ])
  ]
})
export class ConfirmComponent {

  constructor() { }
  @Input() question: string;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onCloseBox()
  {
    this.close.emit();
  }
  onConfirm()
  {
    this.confirm.emit();
  }

}
