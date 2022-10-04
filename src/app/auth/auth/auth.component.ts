import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';
import { LoginModel } from '../models/login.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent 
{
  errorMessage: string = null;

  isLoading = false;
  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) { }
  isForgotPassword = false;

  onLogin(loginModel: LoginModel)
  {
    this.isLoading = true;
    this.authService.login(loginModel).subscribe(
      response =>
      {
        switch (response.role) {
          case environment.roles.admin:
            this.router.navigate(['/admin']);
            break;
          case environment.roles.supporter:
            this.router.navigate(['/support/tickets']);
            break;
          case environment.roles.customer:
            this.router.navigate(['/customers']);
            break;
          default:
            this.errorMessage = "Invalid role: " + response.role;
            console.error("Invalid role: " + response.role);
        }
      },
      error =>
      {
        this.isLoading = false;
        this.errorMessage = error;
        this.cdr.markForCheck();
      }
    );
  }


  onHandleError()
  {
    this.errorMessage = null;
  }
}
