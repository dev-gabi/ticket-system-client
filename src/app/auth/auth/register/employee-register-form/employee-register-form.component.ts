import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../auth.service';
import { EmployeeRegisterModel } from '../../../models/employee-register.model';
import { RegisterFormProps } from '../../../models/register-form-props.model';
import { RegisterForm } from '../register-form';

@Component({
  selector: 'app-employee-register-form',
  templateUrl: './employee-register-form.component.html'
})
export class EmployeeRegisterFormComponent extends RegisterForm
{

  constructor(protected authService: AuthService, protected cdr: ChangeDetectorRef) { super(authService, cdr); }

  @Input() employeeRegisterFormProps: RegisterFormProps;


  onEmployeeRegister(registerModel: EmployeeRegisterModel)
  {

    this.isLoading = true;
    registerModel = this.setRegisterModelFullProps(registerModel);

    this.authService.employeeRegister(registerModel)
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

  private setRegisterModelFullProps(registerModel)
  {
    registerModel.resetToken = this.employeeRegisterFormProps.employeePreRegisterPasswordToken;
    registerModel.email = this.employeeRegisterFormProps.employeePreRegisterCorporateEmail;
    registerModel.userName = this.employeeRegisterFormProps.employeePreRegisterUserName;
    return registerModel;
  }
}
