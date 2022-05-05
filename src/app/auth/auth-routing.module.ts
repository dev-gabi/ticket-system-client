import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResendEmailConfirmationComponent } from './auth/register/resend-email-confirmation/resend-email-confirmation.component';
import { RegisterResultComponent } from './auth/register/result/register-result.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';



const routes: Routes = [
  {
    path: '', children: [
      { path: 'login', component: AuthComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'register/resend-email', component: ResendEmailConfirmationComponent },
      { path: 'register/result', component: RegisterResultComponent },
      { path: 'reset-password', component: ResetPasswordComponent }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
