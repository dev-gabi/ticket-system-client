import { ChangeDetectorRef, Injectable, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DestroyPolicy } from '../../../utils/destroy-policy';
import { AuthService } from '../../auth.service';

@Injectable()
export abstract class RegisterForm extends DestroyPolicy
{
  constructor(protected authService: AuthService, protected cdr: ChangeDetectorRef) { super(); }

  isLoading = false;
  checkEmail = false;
  @ViewChild('registerForm') form: NgForm;
  error$ = this.authService.error$;

  resetForm()
  {
    this.form.reset();
    this.isLoading = false;
    this.cdr.markForCheck();
  }

  onCloseAlert()
  {
    this.authService.clearError();
  }
}
