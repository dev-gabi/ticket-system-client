import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { DestroyPolicy } from '../../../utils/destroy-policy';
import { AuthService } from '../../auth.service';
import { ResetPassword } from '../../models/reset-password.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent extends DestroyPolicy implements OnInit
{

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private cdr: ChangeDetectorRef) { super(); }

  resetToken: string;
  userId: string;
  message: string;
  isLoading = false;
  isSuccess = false;
  error$ = this.authService.error$;
  @ViewChild('f') form: NgForm;


  ngOnInit(): void
  {
    this.route.queryParams.pipe(
      switchMap((params: Params) =>
      {
        this.resetToken = params["token"];
        this.userId = params["id"];
        return this.authService.validateRegistrationToken(this.resetToken, params["email"])
      }),
      takeUntil(this.destroy$),
    ).subscribe(
      (isValid: boolean) =>
      {
        if (!isValid) {
          this.message = "Token was expired. \n contact your admin to get a new registation email.";
          this.cdr.markForCheck();
        }
  
      }
    );

  }
  onSubmit(formData: { newPassword: string, confirmPassword: string })
  {
    this.isLoading = true;
    this.form.reset();
    this.cdr.markForCheck();

    const resetPasswordData: ResetPassword = {
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
      userId: this.userId,
      resetToken: this.resetToken
    };

    this.authService.resetPassword(resetPasswordData).pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      response =>
      {
        this.message = response.message;
        this.isSuccess = true;
        this.hideLoadingIndicator();
      },
      error => this.hideLoadingIndicator()
    );
  }

  onConfirm()
  {
    if (this.isSuccess) {
     
    } else {
      this.message = null;
    }
    this.router.navigate(['/auth/login']);
  }

  onCloseAlert()
  {
    this.authService.clearError();
  }

  hideLoadingIndicator()
  {
    this.isLoading = false;
    this.cdr.markForCheck();
  }
}
