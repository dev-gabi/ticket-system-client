import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../auth.service';
import { EmployeePreRegisterModel } from '../../../models/employee-pre-register.model';
import { RegisterForm } from '../register-form';

@Component({
  selector: 'app-employee-pre-register-form',
  templateUrl: './employee-pre-register-form.component.html'
})
export class EmployeePreRegisterFormComponent extends RegisterForm
{

  constructor(protected authService: AuthService, protected cdr: ChangeDetectorRef) { super(authService, cdr); }
  @ViewChild('registerForm') form: NgForm;
  message: string = null;
  employeeRoles = [environment.roles.admin, environment.roles.supporter];


  onEmployeePreRegister(registerModel: EmployeePreRegisterModel)
  {
    this.isLoading = true;
    this.authService.preRegisterEmployee(registerModel)
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(response =>
      {
        this.message = response.message;
        this.form.reset();
        this.hideLoadingIndicator();
      },
        error => this.hideLoadingIndicator());
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
