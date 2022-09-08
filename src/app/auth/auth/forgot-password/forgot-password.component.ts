import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs/operators';
import { DestroyPolicy } from '../../../utils/destroy-policy';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent extends DestroyPolicy
{

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) { super(); }
  message: string ;
  isLoading = false;
  error$ = this.authService.error$;
  @ViewChild('f') form: NgForm;

  onSubmit(email: string)
  {
    this.isLoading = true;
    this.authService.forgotPassword(email).pipe(
      finalize(() =>
      {
        this.isLoading = false;
        this.cdr.markForCheck();
      }),
      takeUntil(this.destroy$)
    ).subscribe(
      response =>
      {
          this.message = response.message;
      }
    );
  }
  onConfirm()
  {
    this.message = null;
    this.form.reset();
    this.cdr.markForCheck();
  }

  onCloseAlert()
  {
    this.authService.clearError();
  }
}
