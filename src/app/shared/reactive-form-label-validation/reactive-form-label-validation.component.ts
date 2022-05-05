import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-label-validation',
  templateUrl: './reactive-form-label-validation.component.html'
})
export class ReactiveFormLabelValidationComponent implements OnInit {

  constructor() { }
  @Input() form: FormGroup ;
  @Input() inputName: string;
  ngOnInit(): void {
  }

}
