import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { DestroyPolicy } from '../../../utils/destroy-policy';
import { AuthService } from '../../auth.service';
import { RegisterFormProps } from '../../models/register-form-props.model';
import { RegisterFormTypes } from '../../models/register-form-types.model';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent extends DestroyPolicy implements OnInit, OnDestroy
{
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) { super(); }


  formType: string;
  error$ = this.authService.error$;
  employeeRegisterFormProps: RegisterFormProps;
  formTypes: RegisterFormTypes;

  ngOnInit(): void {
    this.setFormTypes();

    if (this.authService.getLoggedInUser()) {
      //only admin can register while logged in = employee pre register form
      this.formType = this.formTypes.employeePreRegisterFormType;
    }
    else {
      this.setFormByQueryParams();
    }
  }

  setFormTypes()
  {
    this.formTypes = {
      customerFormType: environment.registerType.customer,
      employeePreRegisterFormType : environment.registerType.employeePreRegister,
      employeeRegisterFormType : environment.registerType.employeeRegister
    }
  }
  setEmployeeRegisterFormValues(params:Params)
  {
    this.employeeRegisterFormProps =  {
      employeePreRegisterUserName : params["userName"],
      employeePreRegisterCorporateEmail : params["email"],
      employeePreRegisterPasswordToken : params["token"]
    }
  }
  setFormByQueryParams()
  {

      this.route.queryParams.pipe(
        tap((params: Params) =>
        {
          if (params["userName"]) {
            //userName is in the url only after pre register = employee register form
            this.setEmployeeRegisterFormValues(params);
          }
          else {
            //not logged in and no userName in url = customer register form
            this.formType = this.formTypes.customerFormType;
          }
        }),
        filter((params: Params) => { return params["userName"] }),
        switchMap(() =>
          //if userName in url - check with backend if the registration token is valid
          this.authService.validateRegistrationToken(
            this.employeeRegisterFormProps.employeePreRegisterPasswordToken,
            this.employeeRegisterFormProps.employeePreRegisterCorporateEmail
          )),
        takeUntil(this.destroy$)
      ).subscribe(
        ((isRegisterTokenValid: boolean) =>
        {
          isRegisterTokenValid ? this.formType =
          this.formTypes.employeeRegisterFormType :
          this.authService.setError("Invalid registration token. \n Most likely token was expired. \n contact your admin to get a new registation email.");        
          this.cdr.markForCheck();
        })
      );
   
    }

  onCloseAlert()
  {
    this.authService.clearError();
  }
}
