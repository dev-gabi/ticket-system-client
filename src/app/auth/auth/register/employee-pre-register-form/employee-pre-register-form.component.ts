import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { DestroyPolicy } from '../../../../utils/destroy-policy';
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

  message: string = null;
  employeeRoles = [environment.roles.admin, environment.roles.supporter];


  onEmployeePreRegister(registerModel: EmployeePreRegisterModel)
  {
    this.isLoading = true;
    this.authService.preRegisterEmployee(registerModel)
      .pipe(
        finalize(() => this.resetForm()),
        takeUntil(this.destroy$))
      .subscribe(response =>
      {
        this.message = response.message;
      });
  }

  onCloseAlert()
  {
    this.authService.clearError();
  }

  resetForm()
  {
    this.form.reset();
    this.isLoading = false;
    this.cdr.markForCheck();
  }
}
