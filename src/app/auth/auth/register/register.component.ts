import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth.service';
import { CustomerRegisterModel } from '../../models/customer-register.model';
import { EmployeePreRegisterModel } from '../../models/employee-pre-register.model';
import { EmployeeRegisterModel } from '../../models/employee-register.model';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit, OnDestroy
{

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }
  @ViewChild('registerForm') form: NgForm;
  isLoading = false;
  formType: string;
  checkEmail = false;
  employeePreRegisterUserName: string;
  employeePreRegisterCorporateEmail: string;
  employeePreRegisterPasswordToken: string;
  message: string = null;
  paramsSub: Subscription;

  customerFormType = environment.registerType.customer;
  employeePreRegisterFormType = environment.registerType.employeePreRegister;
  employeeRegisterFormType = environment.registerType.employeeRegister;
  employeeRoles = [environment.roles.admin, environment.roles.supporter];

  ngOnInit(): void {

    if (this.authService.user.value != null) {//user logged in - only admin can register while logged in
      this.formType = this.employeePreRegisterFormType;
    } else {
      this.paramsSub =  this.route.queryParams.subscribe((params: Params) =>
      {
        if (params["userName"] != null) {     //userName is in the url after pre register
          this.employeePreRegisterUserName = params["userName"];
          this.employeePreRegisterCorporateEmail = params["email"];
          this.employeePreRegisterPasswordToken = params["token"];
          this.authService.validateRegistrationToken(this.employeePreRegisterPasswordToken, this.employeePreRegisterCorporateEmail).subscribe(
            ((response: boolean) =>
            {             
              response ? this.formType = this.employeeRegisterFormType : this.message = "Invalid registration token. \n Most likely token was expired. \n contact your admin to get a new registation email." ;
              
            }),
            error => { this.message = "Invalid registration token"; }
          );
        }
        else if (this.authService.user.value == null && params["userName"] == null) {//not logged in and no userName in url - only customer
          this.formType = this.customerFormType;
        }
      });
    }

  }

  onCustomerRegister(registerModel: CustomerRegisterModel)
  {
    this.isLoading = true;
    this.authService.customerRegister(registerModel).subscribe(
      response =>
      {
        this.form.reset();
        this.isLoading = false;
        this.checkEmail = true;       
      },
      error =>
      {
        this.form.reset();
        this.message = error;
      }
    );
  }

  onEmployeePreRegister(registerModel: EmployeePreRegisterModel)
  {
    this.isLoading = true;
    this.authService.preRegisterEmployee(registerModel).subscribe(
      response =>
      {
        this.form.reset();
        this.isLoading = false;
        response.errors != null ? this.message = response.errors.toString() : this.message = response.message;
      },
      error =>
      {
        this.form.reset();
        this.message = error;
      }
    );
  }
  onEmployeeRegister(registerModel: EmployeeRegisterModel) {

    this.isLoading = true;
    registerModel.resetToken = this.employeePreRegisterPasswordToken;
    registerModel.email = this.employeePreRegisterCorporateEmail;
    registerModel.userName = this.employeePreRegisterUserName;
    this.authService.employeeRegister(registerModel).subscribe(
      response =>
      {
        this.form.reset();
        this.isLoading = false;
        if (response.errors != null) {
          this.message = response.errors.toString();
        } else {
          this.checkEmail = true;
        }
      },
      error =>
      {
        this.form.reset();
        this.message = error;
      }
    );
  }

  onHandleError()
  {
    this.isLoading = false;
    this.message = null;
  }
  onSendConfirmationEmail()
  {
    this.router.navigate(['/auth/register/resend-email']);
  }
  ngOnDestroy()
  {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }

}
