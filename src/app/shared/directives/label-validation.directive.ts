import { ChangeDetectorRef, Directive, ElementRef, HostBinding, Input, Renderer2 } from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';

@Directive({
  selector: '[labelValidation]'
})

export class LabelValidationDirective 
{
  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  @Input() labelValidation: boolean;
  
  invalidClass = 'danger invalid-circle';
  validClass = 'success';

  @HostBinding('class') class: string;

  ngOnChanges(changes: any)
  {
      this.labelValidation ? this.displayValid() : this.displayInvalid();
  }

  displayValid()
  {
    this.class = this.validClass;
    this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', '&#10003;');
  }
  displayInvalid()
  {
    this.class = this.invalidClass;
    this.renderer.setProperty(this.elementRef.nativeElement,'innerHTML', '&nbsp;'  );
  }

}
