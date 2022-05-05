import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {

  constructor(private authService: AuthService) { }
  message: string ;
  isLoading = false;
  @ViewChild('f') form: NgForm;
  onSubmit(email: string)
  {
    this.isLoading = true;
    this.authService.forgotPassword(email).subscribe(
      response =>
      {
        if (response.isSuccess) {
          this.message = response.message;
        } else {
          this.message = response.errors.toString()  ;
        }
        this.isLoading = false;
      },
      error =>
      {
        this.isLoading = false;
        this.message = error
      });
  }
  onConfirm()
  {
    this.message = null;
    this.form.reset();
  }
}
