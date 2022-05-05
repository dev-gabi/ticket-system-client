import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';
import { ResetPassword } from '../../models/reset-password.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit, OnDestroy
{

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  resetToken: string;
  userId: string;
  message: string;
  isLoading = false;
  isSuccess = false;
  @ViewChild('f') form: NgForm;
  paramsSub: Subscription;

  ngOnInit(): void
  {
    this.paramsSub = this.route.queryParams.subscribe(
        (params: Params) =>
        {
          this.resetToken = params["token"];
          this.userId = params["id"];
        this.authService.validateRegistrationToken(this.resetToken, params["email"]).subscribe(
          ((isValid: boolean) =>
          {
            if (!isValid)  this.message = "Token was expired. \n contact your admin to get a new registation email.";

          }),
          error => { this.message = "Invalid registration token"; }
        );
        }
      )
  }
  onSubmit(formData:{newPassword:string, confirmPassword:string})
  {
    this.isLoading = true;
    const resetPasswordData = new ResetPassword(formData.newPassword, formData.confirmPassword, this.userId, this.resetToken);
    this.form.reset();
    this.authService.resetPassword(resetPasswordData).subscribe(
      response =>
      {
        if (response.isSuccess) {
          this.message = response.message;
          this.isSuccess = true;
        } else {
          this.message = response.errors.toString();
        }
        this.isLoading = false;
      },
      error =>
      {
        this.message = error;
        this.isLoading = false;
      }
    );
  }
  onConfirm()
  {
    this.message = null;
    if (this.isSuccess) {
      this.router.navigate(['/auth/login']);
    }
  }
  ngOnDestroy()
  {
    if (this.paramsSub)
      this.paramsSub.unsubscribe();
  }
}
