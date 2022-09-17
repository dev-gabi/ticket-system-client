import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import ls from 'localstorage-slim';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BaseService } from '../utils/base-service';
import { ApiResponse } from './models/api-response.model';
import { AuthUser } from './models/auth-user.model';
import { CustomerRegisterModel } from './models/customer-register.model';
import { EmployeePreRegisterModel } from './models/employee-pre-register.model';
import { EmployeeRegisterModel } from './models/employee-register.model';
import { LoginResponse } from './models/login-response.model';
import { LoginModel } from './models/login.model';
import { ResetPassword } from './models/reset-password.model';
import { StoreCollection } from './models/store-colection.model';
import { AuthQuery } from './store/auth.query';

@Injectable({
  providedIn: 'root'
})

export class AuthService extends BaseService
{
  tokenExpirationTimer: any = null;
  loggingOut = new Subject<void>();
  lsObfuscateKey = 80;

  constructor(private router: Router, private http: HttpClient, private authQuery: AuthQuery,
    private storeCollection: StoreCollection, @Inject(PLATFORM_ID) private platformId) { super(); }

  login(loginModel: LoginModel)
  {
    ls.config.encrypt = true;
    ls.config.secret = this.lsObfuscateKey;
    return this.http.post<LoginResponse>(environment.endpoints.auth.login, loginModel).pipe(
     // catchError(this.handleUserError),
      catchError(this.handleHttpError),
      tap(response =>
      {
        const expirationDate = new Date(new Date().getTime() + +response.expireInSeconds * 1000);
        const user = new AuthUser(response.id, response.userName, response.role, response.token, expirationDate);
        this.storeCollection.authStore.setObjects([user]);
        this.storeCollection.authStore.setActive(user.id);
        this.autoLogout(+response.expireInSeconds * 1000);
       //  localStorage.setItem(environment.localStorage.userKey, JSON.stringify(user));
        ls.set(environment.localStorage.userKey, user)
      })
    );  
  }

  browserPlatformAutoLogin()
  {
    if (isPlatformBrowser(this.platformId)) {
      this.autoLogin();
   
    }
  }

  private autoLogin()
  {
    ls.config.encrypt = true;
    ls.config.secret = this.lsObfuscateKey;

    const userData = this.getUserDataFromLocalStorage();
    if (!userData) { return; }
    const loadedUser = new AuthUser(userData.id, userData.userName, userData.role, userData._token, new Date(userData._expiresIn));

    if (loadedUser.token) {
      this.storeCollection.authStore.setObjects([loadedUser]);
      this.storeCollection.authStore.setActive(loadedUser.id);
      const tokenExpirationInMiliseconds: number = new Date(loadedUser._expiresIn).getTime() - new Date().getTime();
      this.autoLogout(tokenExpirationInMiliseconds);
    }

  }


  private getUserDataFromLocalStorage()
  {
    const userData: {
      id: string,
      userName: string,
      role: string,
      _token: string,
      _expiresIn: string
    } = ls.get(environment.localStorage.userKey, { decrypt: true });
    // } = JSON.parse(localStorage.getItem(environment.localStorage.userKey));
    return userData;
  }
  customerRegister(registerModel: CustomerRegisterModel)
  {
    return this.http.post<ApiResponse>(environment.endpoints.auth.registerCustomer, registerModel).pipe(
      catchError(this.handleHttpError)
    );
  }

  preRegisterEmployee(preRegisterModel: EmployeePreRegisterModel)
  {
    return this.http.post<ApiResponse>(environment.endpoints.auth.preRegisterEmployee, preRegisterModel).pipe(
      catchError(this.handleHttpError)
    );
  }
  employeeRegister(registerModel: EmployeeRegisterModel) {
    return this.http.post<ApiResponse>(environment.endpoints.auth.registerEmployee, registerModel).pipe(
      catchError(this.handleHttpError)//test server error!!!
    );
  }

  logOut()
  {
    console.log("logout");
    this.loggingOut.next();
    this.router.navigate(['/']);
  
    this.http.get(environment.endpoints.auth.logout).subscribe();

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
 
    localStorage.removeItem(environment.localStorage.userKey);

    this.clearStoreCollection();
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
  private clearStoreCollection()
  {

    this.storeCollection.customersStore.clear();
    this.storeCollection.supportersStore.clear();
     this.storeCollection.ticketsStore.clearTickets();
    this.storeCollection.authStore.clear();
  }
  getLoggedInUser()
  {
    return this.authQuery.getActive() as AuthUser;
  }
  getLoggedInUser$()
  {
    return this.authQuery.selectActive() as Observable<AuthUser>;
  }
  resendConfirmationEmail(email:string)
  {
    return this.http.post<ApiResponse>(environment.endpoints.auth.resendEmailConfirmation, email).pipe(
      catchError(this.handleHttpError)
    );
  }

  forgotPassword(email: string)
  {
    return this.http.post<ApiResponse>(environment.endpoints.auth.forgotPassword, email).pipe(
      catchError(this.handleHttpError)
    );
  }

  resetPassword(resetPasswordData: ResetPassword)
  {
    return this.http.post<ApiResponse>(environment.endpoints.auth.resetPassword, resetPasswordData).pipe(
      catchError(this.handleHttpError)
    );
  }
  refreshRegistrationToken(email: string)
  {
    return this.http.post<ApiResponse>(environment.endpoints.auth.refreshRegistrationToke, email).pipe(
      catchError(this.handleHttpError)
    );
  }

  validateRegistrationToken(token: string, email:string)
  {
    const validateReq = { token, email };
    return this.http.post<boolean>(environment.endpoints.auth.validateRegistrationToken, validateReq).pipe(
      catchError(this.handleHttpError)
    );
  }
}
