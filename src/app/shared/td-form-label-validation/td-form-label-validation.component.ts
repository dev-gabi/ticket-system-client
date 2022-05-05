import { Component, Input, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-td-form-label-validation',
  templateUrl: './td-form-label-validation.component.html'
})
export class TdFormLabelValidationComponent implements OnInit {

  constructor() { }
  @Input() inputName: NgModel;
  ngOnInit(): void {
  }

}
