import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { ErrorModel } from './error-log/error.model';
import { AuthLog } from './auth-log/auth-log.model';


@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient) { }

  private errorLogSubject = new BehaviorSubject<ErrorModel[]>(null);
  private authLogSubject = new BehaviorSubject<AuthLog[]>(null);
  authLogs$ = this.authLogSubject.asObservable();
  errorLogs$ = this.errorLogSubject.asObservable();

  fetchErrorLogs()
  {
    this.http.get<ErrorModel[]>(environment.endpoints.logs.getErrorLogs).pipe(
      catchError((response: HttpErrorResponse) =>
      {
        return throwError(response.error);
      }),
      tap(errors => this.errorLogSubject.next(errors))
    ).subscribe();
  }
  fetchAuthLogs()
  {

    this.http.get<AuthLog[]>(environment.endpoints.logs.getAuthLogs).pipe(
      catchError((response: HttpErrorResponse) =>
      {
        return throwError(response.error);
      }),
      tap(logs =>  this.authLogSubject.next(logs) )
    ).subscribe();
  }
}
