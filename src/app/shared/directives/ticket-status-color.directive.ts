import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { environment } from '../../../environments/environment';

@Directive({
  selector: '[statusColor]'
})
export class TicketStatusColorDirective implements OnInit
{
  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }
  @Input() statusColor: string;

  ngOnInit()
  {
    this.setColor();
  }
  ngOnChanges()
  {
    this.setColor();
  }
  setColor()
  {
    switch (this.statusColor) {
      case environment.ticketStatus.open:
        this.renderer.setStyle(this.elementRef.nativeElement, 'color', '#34e084');
        break;
      case environment.ticketStatus.closed:
        this.renderer.setStyle(this.elementRef.nativeElement, 'color', '#ed4040');
        break;
    }
  }
}
