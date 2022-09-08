import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../auth.service';
import { CustomerRegisterModel } from '../../../models/customer-register.model';
import { RegisterForm } from '../register-form';

@Component({
  selector: 'app-customer-register-form',
  templateUrl: './customer-register-form.component.html'
})
export class CustomerRegisterFormComponent extends RegisterForm 
{
  constructor(protected authService: AuthService, protected cdr: ChangeDetectorRef, private router: Router) { super(authService, cdr); }

  onCustomerRegister(registerModel: CustomerRegisterModel)
  {
    this.isLoading = true;
    this.authService.customerRegister(registerModel)
      .pipe(
        finalize(() => this.resetForm()),
        takeUntil(this.destroy$))
      .subscribe(
        response =>
        {
          this.checkEmail = true;
        }
      );
  }

  onSendConfirmationEmail()
  {
    this.router.navigate(['/auth/register/resend-email']);
  }
}
