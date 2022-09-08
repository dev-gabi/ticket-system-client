import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';


@Injectable({ providedIn: 'root' })
export abstract class BaseService
{
  
  protected errorSubject = new Subject<string>();
  error$ = this.errorSubject.asObservable();

  protected handleHttpError = (response: HttpErrorResponse) =>
  {
    let error: string = "";
    if (response.status == 0) {
      error = "A Network Error Has Occured, please notify the site's webmaster";
    }
    else if (response.error.errors) {
      if (response.error.errors.UserName) {
        response.error.errors.UserName.map((er: string) => error += " " + er );
      }
      if (response.error.errors.Email) {
        response.error.errors.Email.map((er: string) => error += " " + er + " .");
      }
      if (response.error.errors.PersonalEmail) {
        response.error.errors.PersonalEmail.map((er: string) => error += " " + er + " .");
      }
      if (response.error.errors.PhoneNumber) {
        response.error.errors.PhoneNumber.map((er: string) => error += " " + er + " .");
      }
      if (response.error.errors.Address) {
        response.error.errors.Address.map((er: string) => error += " " + er + " .");
      }

      if (Array.isArray(response.error.errors)) {
        response.error.errors.map((er: string) => error += " " + er + " .");
      } 
    }
    else if (response.error?.detail) {
      error += response.error?.detail;
    }
    else {
      error = response.message;
    }

    this.errorSubject.next(error);
    return throwError(error);
  }

  clearError()
  {
    this.errorSubject.next(null);
  }
  setError(error: string)
  {
    this.errorSubject.next(error);
  }
}
