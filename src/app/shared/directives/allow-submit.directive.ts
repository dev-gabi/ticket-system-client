import { Directive,  HostBinding, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[allowSubmit]'
})

export class AllowSubmitDirective implements OnInit
{
  constructor() { }
  @Input() allowSubmit: boolean ;
  defautCursorStyle = 'not-allowed';
  pointerCursorStyle = 'pointer';
  @HostBinding('style.cursor') cursorStyle: string = this.defautCursorStyle;
  ngOnInit()
  {
    this.allowSubmit ? this.cursorStyle = this.pointerCursorStyle : this.cursorStyle = this.defautCursorStyle;
  }
  ngOnChanges(changes: any)
  {
    if (changes["allowSubmit"].currentValue) {
      this.cursorStyle = this.pointerCursorStyle;
    } else {
      this.cursorStyle = this.defautCursorStyle;
    }

  }

}
