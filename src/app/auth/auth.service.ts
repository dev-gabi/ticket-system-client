import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import ls from 'localstorage-slim';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BaseUser } from '../shared/base-user.model';
import { TicketService2 } from '../tickets/ticket.service2';
import { ApiResponse } from './models/api-response.model';
import { AuthUser } from './models/auth-user.model';
import { CustomerRegisterModel } from './models/customer-register.model';
import { EmployeePreRegisterModel } from './models/employee-pre-register.model';
import { EmployeeRegisterModel } from './models/employee-register.model';
import { LoginResponse } from './models/login-response.model';
import { LoginModel } from './models/login.model';
import { ResetPassword } from './models/reset-password.model';


@Injectable({
  providedIn: 'root'
})

export class AuthService
{
  user = new BehaviorSubject<AuthUser>(null);
  error = new Subject<string>();
  tokenExpirationTimer: any = null;
  lsObfuscateKey = 80;
  userSearchList = new Subject <BaseUser[]>();

  constructor(private router: Router, private http: HttpClient) { }

  login(loginModel: LoginModel)
  {
    ls.config.encrypt = true;
    ls.config.secret = this.lsObfuscateKey;
    return this.http.post<LoginResponse>(environment.endpoints.auth.login, loginModel).pipe(
      catchError(this.handleUserError),
      tap(response =>
      {
        const expirationDate = new Date(new Date().getTime() + +response.expireInSeconds * 1000);
        const user = new AuthUser(response.id, response.userName, response.role, response.token, expirationDate);
        this.user.next(user); 
        this.autoLogout(+response.expireInSeconds * 1000);
       //  localStorage.setItem(environment.localStorage.userKey, JSON.stringify(user));
        ls.set(environment.localStorage.userKey, user)
      })
    );  
  }

  autoLogin()
  {
    ls.config.encrypt = true;
    ls.config.secret = this.lsObfuscateKey;

    const userData: {
      id: string,
      userName: string,
      role:string,
      _token: string,
      _expiresIn: string
    } = ls.get(environment.localStorage.userKey, { decrypt: true });
   // } = JSON.parse(localStorage.getItem(environment.localStorage.userKey));
    if (!userData) { return }
    const loadedUser = new AuthUser(userData.id, userData.userName, userData.role, userData._token, new Date(userData._expiresIn));
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const tokenExpirationInMiliseconds: number = new Date(loadedUser._expiresIn).getTime() - new Date().getTime();
      this.autoLogout(tokenExpirationInMiliseconds);
    }
  }

  customerRegister(registerModel: CustomerRegisterModel)
  {
    return this.http.post<ApiResponse>(environment.endpoints.auth.registerCustomer, registerModel).pipe(
      catchError(this.handleUserError)
    );
  }
  preRegisterEmployee(preRegisterModel: EmployeePreRegisterModel)
  {
    return this.http.post<ApiResponse>(environment.endpoints.auth.preRegisterEmployee, preRegisterModel).pipe(
      catchError(this.handleUserError)
    );
  }
  employeeRegister(registerModel: EmployeeRegisterModel) {
    return this.http.post<ApiResponse>(environment.endpoints.auth.registerEmployee, registerModel).pipe(
      catchError(this.handleUserError)
    );
  }
  handleUserError(response: HttpErrorResponse)
  {
    let error = response.message;
    if (response.status === 0) {
      error = "A Network Error Has Occured, please notify the site's webmaster";
      return throwError(error);
    }

    if (response.error.errors) {

      if (response.error.errors.UserName) {
        response.error.errors.UserName.map((er: string) => error += " " + er + " .");
      }
      if (response.error.errors.Password) {
        response.error.errors.Password.map((er: string) => error += " " + er + " .");
      }
      if (response.error.errors.ConfirmPassword) {
        response.error.errors.ConfirmPassword.map((er: string) => error += " " + er + " .");
      }
      if (response.error.errors.Email) {
        response.error.errors.Email.map((er: string) => error += " " + er + " .");
      }
      if (response.error.errors.Role) {
        response.error.errors.Role.map((er: string) => error += " " + er + " .");
      }
      if (response.error.errors.PhoneNumber) {
        response.error.errors.PhoneNumber.map((er: string) => error += " " + er + " .");
      }
      if (response.error.errors.Address) {
        response.error.errors.Address.map((er: string) => error += " " + er + " .");
      }

      if (Array.isArray(response.error.errors)) {
        response.error.errors.map((er: string) => error += " " + er + " .");
      } else {
        error = " " + response.error.errors;
      }
    } 
    return throwError(error);
  }
  handleNetworkError(response: HttpErrorResponse)
  {
    if (response.status === 0) {
      return throwError("A Network Error Has Occured")
    }
    else if (response.error.errors != null) {
      return throwError(response.error.errors.toString())
    }
    else {
      return throwError("Unknown error")
    }
  }
  logOut()
  {
    this.http.get(environment.endpoints.auth.logout).subscribe();
    this.user.next(null);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    localStorage.removeItem(environment.localStorage.userKey);
    this.router.navigate(['/']);
  }
  autoLogout(expirationDuration: number)//in miliseconds
  {
    this.tokenExpirationTimer = setTimeout(
      () =>
      {
        this.logOut();
      }
      , expirationDuration)
  }
  resendConfirmationEmail(email:string)
  {
    return this.http.post<ApiResponse>(environment.endpoints.auth.resendEmailConfirmation, email).pipe(
      catchError((response: HttpErrorResponse) => { return throwError(response.error.errors); })
    );
  }
  forgotPassword(email: string)
  {
    return this.http.post<ApiResponse>(environment.endpoints.auth.forgotPassword, email).pipe(
      catchError(this.handleNetworkError)
    );
  }
  resetPassword(resetPasswordData: ResetPassword)
  {
    return this.http.post<ApiResponse>(environment.endpoints.auth.resetPassword, resetPasswordData).pipe(
      catchError(this.handleNetworkError)
    );
  }
  refreshRegistrationToken(email: string)
  {
    return this.http.post<ApiResponse>(environment.endpoints.auth.refreshRegistrationToke, email).pipe(
      catchError(this.handleNetworkError)
    );
  }
  validateRegistrationToken(token: string, email:string)
  {
    const validateReq = { token, email };
    return this.http.post<boolean>(environment.endpoints.auth.validateRegistrationToken, validateReq).pipe(
      catchError(this.handleNetworkError)
    );
  }


}
