import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { DestroyPolicy } from '../../../../utils/destroy-policy';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-refresh-token',
  templateUrl: './refresh-token.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RefreshTokenComponent extends DestroyPolicy
{

  isLoading = false;
  message: string = null;
  @ViewChild('f') form: NgForm;
  error$ = this.authService.error$;

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) { super();}

  onSubmit( email: string)
  {

    this.isLoading = true;
    this.authService.refreshRegistrationToken(email).pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      response =>
      {
        this.message = response.message;
        this.form.reset();
        this.hideLoadingIndicator();
      }, error => this.hideLoadingIndicator()
    )
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
