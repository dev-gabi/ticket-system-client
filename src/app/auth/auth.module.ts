import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth/auth.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { RefreshTokenComponent } from './auth/register/refresh-token/refresh-token.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResendEmailConfirmationComponent } from './auth/register/resend-email-confirmation/resend-email-confirmation.component';
import { RegisterResultComponent } from './auth/register/result/register-result.component';
import { RegisteredUsersComponent } from './auth/registered-users/registered-users.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { SeedTicketsComponent } from './auth/seed-tickets/seed-tickets.component';
import { CustomerRegisterFormComponent } from './auth/register/customer-register-form/customer-register-form.component';
import { EmployeePreRegisterFormComponent } from './auth/register/employee-pre-register-form/employee-pre-register-form.component';
import { EmployeeRegisterFormComponent } from './auth/register/employee-register-form/employee-register-form.component';


@NgModule({
  declarations: [
    AuthComponent,
    RegisterComponent,
    ResendEmailConfirmationComponent,
    RegisterResultComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    RefreshTokenComponent,
    SeedTicketsComponent,
    RegisteredUsersComponent,
    CustomerRegisterFormComponent,
    EmployeePreRegisterFormComponent,
    EmployeeRegisterFormComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
