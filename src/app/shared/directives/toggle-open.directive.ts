import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[toggleOpen]',
})
export class ToggleOpenDirective
{
  @HostBinding('class.open') isActive = false;

  constructor() { }
  
  @HostListener('click', ['$event']) onClick()
  {
    this.isActive = !this.isActive;
  }
}
