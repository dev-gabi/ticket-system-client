import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-resend-email-confirmation',
  templateUrl:'resend-email-confirmation.component.html'
})

export class ResendEmailConfirmationComponent
{
  isLoading = false;
  message: string = null;
  @ViewChild('f') form: NgForm;
  constructor(private authService: AuthService, private router: Router) { }
  onSubmit(email:string)
  {
    this.isLoading = true;
    this.authService.resendConfirmationEmail(email).subscribe(
      response =>
      {
        this.isLoading = false;
        if (response.errors == null) {
          this.message = response.message;
          this.form.reset();
        } else {
          this.router.navigate(['/auth/register/result'], { queryParams: { message: response.errors } });
        }
      },
      error =>
      {
        this.isLoading = false;
        this.message = error;
      });
  }


}
